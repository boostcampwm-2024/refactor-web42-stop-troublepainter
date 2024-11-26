import { useCallback, useEffect, useRef, useState } from 'react';
import { LWWMap } from '@troublepainter/core';
import { useParams } from 'react-router-dom';
import { COLORS_INFO, DRAWING_MODE, LINEWIDTH_VARIABLE, DEFAULT_MAX_PIXELS } from '@/constants/canvasConstants';
import { StrokeHistoryEntry } from '@/types/canvas.types';
import { DrawingMode } from '@/types/canvas.types';
import { playerIdStorageUtils } from '@/utils/playerIdStorage';

export const useDrawingState = (options?: { maxPixels?: number }) => {
  const { roomId } = useParams<{ roomId: string }>();
  const currentPlayerId = playerIdStorageUtils.getPlayerId(roomId as string);

  const [currentColor, setCurrentColor] = useState(COLORS_INFO[0].backgroundColor);
  const [brushSize, setBrushSize] = useState(LINEWIDTH_VARIABLE.MIN_WIDTH);
  const [drawingMode, setDrawingMode] = useState<DrawingMode>(DRAWING_MODE.PEN);
  const [inkRemaining, setInkRemaining] = useState(options?.maxPixels ?? DEFAULT_MAX_PIXELS);
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
  };
};
