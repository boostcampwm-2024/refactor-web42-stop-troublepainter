import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { Point, DrawingData, LWWMap, CRDTMessage, MapState, RegisterState, StrokeStyle } from '@troublepainter/core';
import { useParams } from 'react-router-dom';
import type { DrawingMode, RGBA } from '@/types/canvas.types';
import { DEFAULT_MAX_PIXELS, COLORS_INFO, DRAWING_MODE, LINEWIDTH_VARIABLE } from '@/constants/canvasConstants';
import { getCanvasContext } from '@/utils/getCanvasContext';
import { hexToRGBA } from '@/utils/hexToRGBA';
import { playerIdStorageUtils } from '@/utils/playerIdStorage';

interface DrawingOptions {
  maxPixels?: number;
}

interface StrokeHistoryEntry {
  strokeIds: string[];
  isLocal: boolean;
  drawingData: DrawingData;
}

// Fill 모드 유틸리티 함수들
const fillTargetColor = (pos: number, fillColor: RGBA, pixelArray: Uint8ClampedArray) => {
  pixelArray[pos] = fillColor.r;
  pixelArray[pos + 1] = fillColor.g;
  pixelArray[pos + 2] = fillColor.b;
  pixelArray[pos + 3] = fillColor.a;
};

const checkColorisNotEqual = (pos: number, startColor: RGBA, pixelArray: Uint8ClampedArray) => {
  return (
    pixelArray[pos] !== startColor.r ||
    pixelArray[pos + 1] !== startColor.g ||
    pixelArray[pos + 2] !== startColor.b ||
    pixelArray[pos + 3] !== startColor.a
  );
};

/**
 * 캔버스 드로잉 기능을 관리하는 Hook입니다.
 *
 * @remarks
 * 캔버스의 실제 드로잉 작업을 처리하며 다음과 같은 핵심 기능을 제공합니다:
 * - 펜/채우기 모드 드로잉
 * - 실행 취소/다시 실행
 * - 잉크 잔량 관리
 * - 실시간 드로잉 데이터 동기화 및 기록
 *
 * 드로잉은 mousedown부터 mouseup까지를 하나의 단위로 처리하며,
 * 실시간으론 각 stroke 단위로 동기화하고 히스토리는 mouseup 단위로 기록됩니다.
 *
 * @param canvasRef - 캔버스 엘리먼트의 RefObject
 * @param options - 드로잉 설정 옵션
 * @param options.maxPixels - 최대 사용 가능한 픽셀 수
 *
 * @example
 * ```tsx
 * // GameCanvas.tsx에서의 사용 예시
 * const GameCanvas = ({ role, maxPixels = 100000 }: GameCanvasProps) => {
 *   const canvasRef = useRef<HTMLCanvasElement>(null);
 *
 *   const {
 *     currentColor,
 *     brushSize,
 *     drawingMode,
 *     inkRemaining,
 *     startDrawing,
 *     draw,
 *     stopDrawing,
 *     // ... 기타 반환값들
 *   } = useDrawing(canvasRef, { maxPixels });
 *
 *   // 드로잉 이벤트 핸들러
 *   const handleDrawStart = useCallback((e: ReactMouseEvent | ReactTouchEvent) => {
 *     const point = getDrawPoint(e, canvasRef.current);
 *     startDrawing(point);
 *   }, [startDrawing]);
 *
 *   return (
 *     <Canvas
 *       canvasRef={canvasRef}
 *       isDrawable={true}
 *       brushSize={brushSize}
 *       inkRemaining={inkRemaining}
 *       // ... 기타 props
 *     />
 *   );
 * };
 * ```
 *
 * @returns 드로잉 관련 상태와 메소드들
 * - `currentColor` - 현재 선택된 색상
 * - `brushSize` - 현재 브러시 크기
 * - `drawingMode` - 현재 드로잉 모드 (펜/채우기)
 * - `inkRemaining` - 남은 잉크량
 * - `startDrawing` - 드로잉 시작 함수 (mousedown)
 * - `draw` - 드로잉 진행 함수 (mousemove)
 * - `stopDrawing` - 드로잉 종료 함수 (mouseup)
 * - `applyDrawing` - 외부 드로잉 데이터 적용 함수
 * - `undo/redo` - mouseup 단위로 실행 취소/다시 실행하는 함수
 * - `canUndo/canRedo` - 실행 취소/다시 실행 가능 여부
 *
 * @category Hooks
 */
const useDrawing = (canvasRef: RefObject<HTMLCanvasElement>, options?: DrawingOptions) => {
  const { roomId } = useParams<{ roomId: string }>();
  const currentPlayerId = playerIdStorageUtils.getPlayerId(roomId as string);

  // 기본 상태 관리
  const [currentColor, setCurrentColor] = useState(COLORS_INFO[0].backgroundColor);
  const [brushSize, setBrushSize] = useState(LINEWIDTH_VARIABLE.MIN_WIDTH);
  const [drawingMode, setDrawingMode] = useState<DrawingMode>(DRAWING_MODE.PEN);
  const [inkRemaining, setInkRemaining] = useState(options?.maxPixels ?? DEFAULT_MAX_PIXELS);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // CRDT 및 히스토리 관리
  const crdtRef = useRef<LWWMap>();
  const strokeHistoryRef = useRef<StrokeHistoryEntry[]>([]);
  // mouseup 전까지 발생한 모든 점들의 stroke ID를 담고 있는 배열
  const currentStrokeIdsRef = useRef<string[]>([]);
  const historyPointerRef = useRef<number>(-1);

  const getCurrentStyle = useCallback((): StrokeStyle => {
    return {
      color: currentColor,
      width: brushSize,
    };
  }, [currentColor, brushSize]);

  useEffect(() => {
    crdtRef.current = new LWWMap(currentPlayerId || 'player');
    const { ctx } = getCanvasContext(canvasRef);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [currentPlayerId]);

  // 캔버스 전체 다시 그리기
  const redrawCanvas = useCallback(() => {
    if (!crdtRef.current) return;

    const { canvas, ctx } = getCanvasContext(canvasRef);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    crdtRef.current.strokes
      .filter((stroke) => stroke.stroke !== null)
      .forEach(({ stroke }) => {
        drawStroke(stroke);
      });
  }, []);

  // 단일 Stroke 그리는 함수
  const drawStroke = useCallback((drawingData: DrawingData) => {
    const { ctx } = getCanvasContext(canvasRef);
    const { points, style } = drawingData;

    if (points.length === 0) return;

    ctx.strokeStyle = style.color;
    ctx.fillStyle = style.color;
    ctx.lineWidth = style.width;

    ctx.beginPath();
    if (points.length === 1) {
      // 점 하나일 때는 원으로 그리기
      const point = points[0];
      ctx.arc(point.x, point.y, style.width / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // 선으로 연결하기
      ctx.moveTo(points[0].x, points[0].y);
      points.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
      ctx.stroke();
    }
  }, []);

  // Fill 모드 로직
  const floodFill = useCallback(
    (startX: number, startY: number) => {
      const { canvas, ctx } = getCanvasContext(canvasRef);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixelArray = imageData.data;
      const fillColor = hexToRGBA(currentColor);

      const startPos = (startY * canvas.width + startX) * 4;
      const startColor = {
        r: pixelArray[startPos],
        g: pixelArray[startPos + 1],
        b: pixelArray[startPos + 2],
        a: pixelArray[startPos + 3],
      };

      const pixelsToCheck = [[startX, startY]];
      let pixelCount = 0;
      const filledPoints: Point[] = [];

      while (pixelsToCheck.length > 0 && pixelCount < inkRemaining) {
        const [x, y] = pixelsToCheck.shift()!;
        const pos = (y * canvas.width + x) * 4;

        if (
          x < 0 ||
          x >= canvas.width ||
          y < 0 ||
          y >= canvas.height ||
          checkColorisNotEqual(pos, startColor, pixelArray)
        )
          continue;

        fillTargetColor(pos, fillColor, pixelArray);
        filledPoints.push({ x, y });

        pixelsToCheck.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
        pixelCount++;
      }

      ctx.putImageData(imageData, 0, 0);
      setInkRemaining((prev) => Math.max(0, prev - pixelCount));

      return {
        points: filledPoints,
        style: getCurrentStyle(),
      };
    },
    [currentColor, inkRemaining, getCurrentStyle],
  );

  // 히스토리 상태 업데이트
  const updateHistoryState = useCallback(() => {
    const localHistory = strokeHistoryRef.current.filter((entry) => entry.isLocal);

    // 전체 히스토리에서 현재 포인터까지의 로컬 항목 개수를 세기
    const localItemsCount = strokeHistoryRef.current
      .slice(0, historyPointerRef.current + 1)
      .filter((entry) => entry.isLocal).length;

    setCanUndo(localItemsCount > 0);
    setCanRedo(localItemsCount < localHistory.length);
  }, []);

  // 드로잉 시작
  const startDrawing = useCallback(
    (point: Point): CRDTMessage | null => {
      if (inkRemaining <= 0 || !crdtRef.current) return null;

      // 새로운 currentStrokeIdsRef 시작
      currentStrokeIdsRef.current = [];

      const drawingData =
        drawingMode === DRAWING_MODE.FILL
          ? floodFill(Math.floor(point.x), Math.floor(point.y))
          : {
              points: [point],
              style: getCurrentStyle(),
            };

      if (!drawingData) return null;

      const strokeId = crdtRef.current.addStroke(drawingData);
      currentStrokeIdsRef.current.push(strokeId);
      drawStroke(drawingData);

      return {
        type: 'update',
        state: {
          key: strokeId,
          register: crdtRef.current.state[strokeId],
        },
      };
    },
    [inkRemaining, getCurrentStyle, drawingMode, floodFill, drawStroke],
  );

  const draw = useCallback(
    (point: Point): CRDTMessage | null => {
      if (!crdtRef.current || inkRemaining <= 0) return null;
      // Fill 모드에서는 draw 동작 없음
      if (drawingMode === DRAWING_MODE.FILL) return null;

      const lastStrokeId = currentStrokeIdsRef.current[currentStrokeIdsRef.current.length - 1];
      const lastStroke = crdtRef.current.strokes.find((s) => s.id === lastStrokeId);
      if (!lastStroke) return null;

      const updatedDrawing = {
        ...lastStroke.stroke,
        points: [...lastStroke.stroke.points, point],
      };

      // 잉크 소비량 계산
      const lastPoint = lastStroke.stroke.points[lastStroke.stroke.points.length - 1];
      const pixelsUsed = Math.ceil(
        Math.sqrt(Math.pow(point.x - lastPoint.x, 2) + Math.pow(point.y - lastPoint.y, 2)) * brushSize,
      );
      setInkRemaining((prev) => Math.max(0, prev - pixelsUsed));

      const strokeId = crdtRef.current.addStroke(updatedDrawing);
      currentStrokeIdsRef.current.push(strokeId);
      drawStroke(updatedDrawing);

      return {
        type: 'update',
        state: {
          key: strokeId,
          register: crdtRef.current.state[strokeId],
        },
      };
    },
    [inkRemaining, brushSize, drawingMode, drawStroke],
  );

  const stopDrawing = useCallback(() => {
    if (!crdtRef.current || currentStrokeIdsRef.current.length === 0) return;

    // 새로운 stroke가 추가되면 redo 히스토리를 비움
    if (historyPointerRef.current < strokeHistoryRef.current.length - 1) {
      strokeHistoryRef.current = strokeHistoryRef.current.slice(0, historyPointerRef.current + 1);
    }

    // 현재 currentStrokeIdsRef의 마지막 stroke 가져오기
    const lastStrokeId = currentStrokeIdsRef.current[currentStrokeIdsRef.current.length - 1];
    const lastStroke = crdtRef.current.strokes.find((s) => s.id === lastStrokeId);

    if (!lastStroke) return;

    // 현재 currentStrokeIdsRef의 모든 stroke를 하나의 히스토리 엔트리로 저장
    strokeHistoryRef.current.push({
      strokeIds: [...currentStrokeIdsRef.current],
      isLocal: true,
      drawingData: lastStroke.stroke,
    });
    historyPointerRef.current = strokeHistoryRef.current.length - 1;

    // 현재 currentStrokeIdsRef 초기화
    currentStrokeIdsRef.current = [];
    updateHistoryState();
  }, [updateHistoryState]);

  // 외부 드로잉 데이터 적용
  const applyDrawing = useCallback(
    (crdtDrawingData: CRDTMessage) => {
      if (!crdtRef.current) return;

      if (crdtDrawingData.type === 'sync') {
        const updatedKeys = crdtRef.current.merge(crdtDrawingData.state as MapState);
        if (updatedKeys.length > 0) {
          // 전체 동기화 후 캔버스 다시 그리기
          redrawCanvas();

          strokeHistoryRef.current = [
            {
              strokeIds: updatedKeys,
              isLocal: false,
              drawingData: crdtRef.current.strokes[crdtRef.current.strokes.length - 1].stroke,
            },
          ];
          historyPointerRef.current = 0;
          updateHistoryState();
        }
      } else if (crdtDrawingData.type === 'update') {
        const { key, register } = crdtDrawingData.state as {
          key: string;
          register: RegisterState<DrawingData | null>;
        };

        const peerId = key.split('-')[0];
        const isLocalUpdate = peerId === currentPlayerId;

        if (crdtRef.current.mergeRegister(key, register)) {
          const stroke = register[2];

          if (!isLocalUpdate) {
            // 원격 업데이트의 경우 캔버스 다시 그리기
            redrawCanvas();

            // stroke가 null이 아닌 경우 (삭제되지 않은 경우) 히스토리 추가
            if (stroke) {
              if (historyPointerRef.current < strokeHistoryRef.current.length - 1) {
                strokeHistoryRef.current = strokeHistoryRef.current.slice(0, historyPointerRef.current + 1);
              }
              strokeHistoryRef.current.push({
                strokeIds: [key],
                isLocal: false,
                drawingData: stroke,
              });
              historyPointerRef.current++;
              updateHistoryState();
            }
          }
        }
      }
    },
    [currentPlayerId, redrawCanvas, updateHistoryState],
  );

  const undo = useCallback(() => {
    if (!crdtRef.current || historyPointerRef.current < 0) return null;

    // 현재 포인터부터 로컬 엔트리 찾기
    let currentEntry = strokeHistoryRef.current[historyPointerRef.current];
    while (currentEntry && !currentEntry.isLocal && historyPointerRef.current > 0) {
      historyPointerRef.current--;
      currentEntry = strokeHistoryRef.current[historyPointerRef.current];
    }

    if (!currentEntry?.isLocal) return null;

    // 현재 엔트리의 모든 stroke 삭제
    const updates = currentEntry.strokeIds.map((strokeId) => {
      crdtRef.current!.deleteStroke(strokeId);
      return {
        type: 'update' as const,
        state: {
          key: strokeId,
          register: crdtRef.current!.state[strokeId],
        },
      };
    });

    historyPointerRef.current--;
    updateHistoryState();
    redrawCanvas();

    return updates;
  }, [redrawCanvas, updateHistoryState]);

  const redo = useCallback(() => {
    if (!crdtRef.current || historyPointerRef.current >= strokeHistoryRef.current.length - 1) return null;

    // 다음 로컬 엔트리 찾기
    let nextEntry = strokeHistoryRef.current[historyPointerRef.current + 1];
    while (nextEntry && !nextEntry.isLocal && historyPointerRef.current < strokeHistoryRef.current.length - 1) {
      historyPointerRef.current++;
      nextEntry = strokeHistoryRef.current[historyPointerRef.current + 1];
    }

    if (!nextEntry?.isLocal) return null;

    // 다음 엔트리의 drawingData로 새 stroke 생성
    const strokeId = crdtRef.current.addStroke(nextEntry.drawingData);
    if (!strokeId) return null;

    // strokeIds 업데이트
    nextEntry.strokeIds = [strokeId];

    const update = {
      type: 'update' as const,
      state: {
        key: strokeId,
        register: crdtRef.current.state[strokeId],
      },
    };

    historyPointerRef.current++;
    updateHistoryState();
    redrawCanvas();

    return [update];
  }, [redrawCanvas, updateHistoryState]);

  return {
    currentColor,
    setCurrentColor,
    brushSize,
    setBrushSize,
    drawingMode,
    setDrawingMode,
    inkRemaining,
    startDrawing,
    draw,
    stopDrawing,
    applyDrawing,
    canUndo,
    canRedo,
    undo,
    redo,
  };
};

export { useDrawing };
