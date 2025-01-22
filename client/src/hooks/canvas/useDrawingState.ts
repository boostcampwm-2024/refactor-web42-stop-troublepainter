import { useCallback, useEffect, useRef, useState } from 'react';
import { LWWMap } from '@troublepainter/core';
import { throttle } from 'lodash';
import { useParams } from 'react-router-dom';
import { COLORS_INFO, DRAWING_MODE, LINEWIDTH_VARIABLE, DEFAULT_MAX_PIXELS } from '@/constants/canvasConstants';
import { useToastStore } from '@/stores/toast.store';
import { StrokeHistoryEntry } from '@/types/canvas.types';
import { DrawingMode } from '@/types/canvas.types';
import { playerIdStorageUtils } from '@/utils/playerIdStorage';

/**
 * 캔버스 드로잉의 상태를 관리하는 Hook입니다.
 *
 * @remarks
 * 드로잉과 관련된 모든 상태를 관리합니다.
 * - 현재 드로잉 설정 (색상, 브러시 크기, 모드)
 * - 잉크 관리
 * - 실행 취소/다시 실행을 위한 히스토리 추적
 * - 협업 드로잉을 위한 CRDT 상태
 *
 * 드로잉 작업과 여러 사용자 간의 동기화를 위한
 * 기반을 제공합니다.
 *
 * @param options - 드로잉 상태 설정 옵션
 * @param options.maxPixels - 드로잉에 사용할 수 있는 최대 픽셀 수
 *
 * @example
 * ```tsx
 * const DrawingComponent = () => {
 *   const {
 *     currentColor,
 *     brushSize,
 *     inkRemaining,
 *     setCurrentColor,
 *     setBrushSize
 *   } = useDrawingState({ maxPixels: 1000 });
 *
 *   return (
 *     <div>
 *       <ColorPicker
 *         value={currentColor}
 *         onChange={setCurrentColor}
 *       />
 *       <BrushSizeSlider
 *         value={brushSize}
 *         onChange={setBrushSize}
 *       />
 *       <InkMeter value={inkRemaining} />
 *     </div>
 *   );
 * };
 * ```
 *
 * @returns 드로잉 상태와 관리 함수들을 포함하는 객체
 * @property currentPlayerId - 현재 플레이어의 고유 식별자
 * @property currentColor - 현재 선택된 색상
 * @property setCurrentColor - 현재 색상을 변경하는 함수
 * @property brushSize - 현재 브러시 크기
 * @property setBrushSize - 브러시 크기를 변경하는 함수
 * @property drawingMode - 현재 드로잉 모드 (펜/채우기)
 * @property setDrawingMode - 드로잉 모드를 변경하는 함수
 * @property inkRemaining - 남은 잉크량
 * @property setInkRemaining - 잉크량을 변경하는 함수
 * @property canUndo - 실행 취소 가능 여부
 * @property canRedo - 다시 실행 가능 여부
 * @property crdtRef - 협업 드로잉을 위한 CRDT 인스턴스 참조
 * @property strokeHistoryRef - 스트로크 히스토리 참조
 * @property currentStrokeIdsRef - 현재 스트로크 ID들의 참조
 * @property historyPointerRef - 히스토리 내 현재 위치 참조
 * @property updateHistoryState - 실행 취소/다시 실행 상태를 업데이트하는 함수
 * @property checkInkAvailability - 잉크 사용 가능 여부를 확인하는 함수
 *
 * @category Hooks
 */
export const useDrawingState = (options?: { maxPixels?: number }) => {
  const { roomId } = useParams<{ roomId: string }>();
  const currentPlayerId = playerIdStorageUtils.getPlayerId(roomId as string);
  const actions = useToastStore((state) => state.actions);

  const maxPixels = options?.maxPixels ?? DEFAULT_MAX_PIXELS;
  const [currentColor, setCurrentColor] = useState(COLORS_INFO[0].backgroundColor);
  const [brushSize, setBrushSize] = useState(LINEWIDTH_VARIABLE.MIN_WIDTH);
  const [drawingMode, setDrawingMode] = useState<DrawingMode>(DRAWING_MODE.PEN);
  const [inkRemaining, setInkRemaining] = useState(maxPixels);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const crdtRef = useRef<LWWMap>();
  const strokeHistoryRef = useRef<StrokeHistoryEntry[]>([]);
  const currentStrokeIdsRef = useRef<string[]>([]);
  const historyPointerRef = useRef<number>(-1);

  useEffect(() => {
    crdtRef.current = new LWWMap(currentPlayerId || 'player');
  }, [currentPlayerId]);

  const updateHistoryState = useCallback(() => {
    const localHistory = strokeHistoryRef.current.filter((entry) => entry.isLocal);
    const currentLocalIndex = localHistory.findIndex((_, index) => index === historyPointerRef.current);

    setCanUndo(currentLocalIndex >= 0);
    setCanRedo(currentLocalIndex < localHistory.length - 1);
  }, [strokeHistoryRef, historyPointerRef, setCanUndo, setCanRedo]);

  const showInkToast = useCallback(
    throttle(() => {
      actions.addToast({
        title: '잉크 부족',
        description: '잉크를 다 써버렸어요 🥲😛😥',
        variant: 'error',
        duration: 2000,
      });
    }, 3000),
    [actions.addToast],
  );

  const checkInkAvailability = useCallback(() => {
    if (inkRemaining <= 0) {
      showInkToast();
      return false;
    }
    return true;
  }, [inkRemaining, actions.addToast, showInkToast]);

  const resetDrawingState = useCallback(() => {
    // CRDT 초기화
    crdtRef.current = new LWWMap(currentPlayerId || 'player');

    // 히스토리 상태 초기화
    strokeHistoryRef.current = [];
    currentStrokeIdsRef.current = [];
    historyPointerRef.current = -1;

    // 잉크량 초기화
    setInkRemaining(maxPixels);

    // Undo/Redo 상태 초기화
    setCanUndo(false);
    setCanRedo(false);
  }, [crdtRef, currentPlayerId, maxPixels, setInkRemaining, setCanUndo, setCanRedo]);

  const inkRef = useRef(inkRemaining);
  const throttleSetInkRemaining = useCallback(
    (fn: (p: number) => number) => {
      if (inkRemaining === 0) return;
      const nextInk = fn(inkRef.current);
      if (nextInk === 0) {
        setInkRemaining(0);
      } else if (inkRef.current === inkRemaining) {
        setTimeout(() => {
          if (inkRef.current > 0) setInkRemaining(inkRef.current);
        }, 500);
      }
      inkRef.current = nextInk;
    },
    [inkRemaining, inkRef],
  );

  return {
    currentPlayerId,
    currentColor,
    setCurrentColor,
    brushSize,
    setBrushSize,
    drawingMode,
    setDrawingMode,
    inkRemaining,
    setInkRemaining: throttleSetInkRemaining,
    canUndo,
    canRedo,
    crdtRef,
    strokeHistoryRef,
    currentStrokeIdsRef,
    historyPointerRef,
    updateHistoryState,
    checkInkAvailability,
    resetDrawingState,
  };
};
