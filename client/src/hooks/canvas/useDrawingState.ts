import { useCallback, useEffect, useRef, useState } from 'react';
import { LWWMap } from '@troublepainter/core';
import { useParams } from 'react-router-dom';
import { COLORS_INFO, DRAWING_MODE, LINEWIDTH_VARIABLE, DEFAULT_MAX_PIXELS } from '@/constants/canvasConstants';
import { useToastStore } from '@/stores/toast.store';
import { StrokeHistoryEntry } from '@/types/canvas.types';
import { DrawingMode } from '@/types/canvas.types';
import { playerIdStorageUtils } from '@/utils/playerIdStorage';

export const useDrawingState = (options?: { maxPixels?: number }) => {
  const { roomId } = useParams<{ roomId: string }>();
  const currentPlayerId = playerIdStorageUtils.getPlayerId(roomId as string);
  const { actions } = useToastStore();

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
    const localItemsCount = strokeHistoryRef.current
      .slice(0, historyPointerRef.current + 1)
      .filter((entry) => entry.isLocal).length;

    setCanUndo(localItemsCount > 0);
    setCanRedo(localItemsCount < localHistory.length);
  }, []);

  const checkInkAvailability = useCallback(() => {
    if (inkRemaining <= 0) {
      actions.addToast({
        title: '잉크 부족',
        description: '잉크를 다 써버렸어요 🥲😛😥',
        variant: 'error',
        duration: 2000,
      });
      return false;
    }
    return true;
  }, [inkRemaining, actions]);

  return {
    currentPlayerId,
    currentColor,
    setCurrentColor,
    brushSize,
    setBrushSize,
    drawingMode,
    setDrawingMode,
    inkRemaining,
    setInkRemaining,
    canUndo,
    canRedo,
    crdtRef,
    strokeHistoryRef,
    currentStrokeIdsRef,
    historyPointerRef,
    updateHistoryState,
    checkInkAvailability,
  };
};
