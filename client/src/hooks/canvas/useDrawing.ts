import { RefObject, useCallback } from 'react';
import {
  Point,
  CRDTMessage,
  MapState,
  RegisterState,
  DrawingData,
  CRDTMessageTypes,
  CRDTUpdateMessage,
} from '@troublepainter/core';
import { useDrawingOperation } from './useDrawingOperation';
import { useDrawingState } from './useDrawingState';
import { DRAWING_MODE } from '@/constants/canvasConstants';

export const useDrawing = (canvasRef: RefObject<HTMLCanvasElement>, options?: { maxPixels?: number }) => {
  const state = useDrawingState(options);
  const operation = useDrawingOperation(canvasRef, state);

  const startDrawing = useCallback(
    (point: Point): CRDTUpdateMessage | null => {
      if (state.inkRemaining <= 0 || !state.crdtRef.current) return null;

      state.currentStrokeIdsRef.current = [];
      const drawingData =
        state.drawingMode === DRAWING_MODE.FILL
          ? operation.floodFill(Math.floor(point.x), Math.floor(point.y))
          : {
              points: [point],
              style: operation.getCurrentStyle(),
            };

      if (!drawingData) return null;

      const strokeId = state.crdtRef.current.addStroke(drawingData);
      state.currentStrokeIdsRef.current.push(strokeId);
      operation.drawStroke(drawingData);

      return {
        type: CRDTMessageTypes.UPDATE,
        state: {
          key: strokeId,
          register: state.crdtRef.current.state[strokeId],
        },
      };
    },
    [state, operation],
  );

  const draw = useCallback(
    (point: Point): CRDTUpdateMessage | null => {
      if (!state.crdtRef.current || state.inkRemaining <= 0) return null;
      if (state.drawingMode === DRAWING_MODE.FILL) return null;

      const lastStrokeId = state.currentStrokeIdsRef.current[state.currentStrokeIdsRef.current.length - 1];
      const lastStroke = state.crdtRef.current.strokes.find((s) => s.id === lastStrokeId);
      if (!lastStroke) return null;

      const updatedDrawing = {
        ...lastStroke.stroke,
        points: [...lastStroke.stroke.points, point],
      };

      const lastPoint = lastStroke.stroke.points[lastStroke.stroke.points.length - 1];
      const pixelsUsed = Math.ceil(
        Math.sqrt(Math.pow(point.x - lastPoint.x, 2) + Math.pow(point.y - lastPoint.y, 2)) * state.brushSize,
      );
      state.setInkRemaining((prev: number) => Math.max(0, prev - pixelsUsed));

      const strokeId = state.crdtRef.current.addStroke(updatedDrawing);
      state.currentStrokeIdsRef.current.push(strokeId);
      operation.drawStroke(updatedDrawing);

      return {
        type: CRDTMessageTypes.UPDATE,
        state: {
          key: strokeId,
          register: state.crdtRef.current.state[strokeId],
        },
      };
    },
    [state, operation],
  );

  const stopDrawing = useCallback(() => {
    if (!state.crdtRef.current || state.currentStrokeIdsRef.current.length === 0) return;

    if (state.historyPointerRef.current < state.strokeHistoryRef.current.length - 1) {
      state.strokeHistoryRef.current = state.strokeHistoryRef.current.slice(0, state.historyPointerRef.current + 1);
    }

    const lastStrokeId = state.currentStrokeIdsRef.current[state.currentStrokeIdsRef.current.length - 1];
    const lastStroke = state.crdtRef.current.strokes.find((s) => s.id === lastStrokeId);

    if (!lastStroke) return;

    state.strokeHistoryRef.current.push({
      strokeIds: [...state.currentStrokeIdsRef.current],
      isLocal: true,
      drawingData: lastStroke.stroke,
    });
    state.historyPointerRef.current = state.strokeHistoryRef.current.length - 1;

    state.currentStrokeIdsRef.current = [];
    state.updateHistoryState();
  }, [state]);

  const undo = useCallback((): CRDTUpdateMessage[] | null => {
    if (!state.crdtRef.current || state.historyPointerRef.current < 0) return null;

    let currentEntry = state.strokeHistoryRef.current[state.historyPointerRef.current];
    while (currentEntry && !currentEntry.isLocal && state.historyPointerRef.current > 0) {
      state.historyPointerRef.current--;
      currentEntry = state.strokeHistoryRef.current[state.historyPointerRef.current];
    }

    if (!currentEntry?.isLocal) return null;

    const updates = currentEntry.strokeIds.map((strokeId): CRDTUpdateMessage => {
      state.crdtRef.current!.deleteStroke(strokeId);
      return {
        type: CRDTMessageTypes.UPDATE,
        state: {
          key: strokeId,
          register: state.crdtRef.current!.state[strokeId],
        },
      };
    });

    state.historyPointerRef.current--;
    state.updateHistoryState();
    operation.redrawCanvas();

    return updates;
  }, [state, operation]);

  const redo = useCallback((): CRDTUpdateMessage[] | null => {
    if (!state.crdtRef.current || state.historyPointerRef.current >= state.strokeHistoryRef.current.length - 1)
      return null;

    let nextEntry = state.strokeHistoryRef.current[state.historyPointerRef.current + 1];
    while (
      nextEntry &&
      !nextEntry.isLocal &&
      state.historyPointerRef.current < state.strokeHistoryRef.current.length - 1
    ) {
      state.historyPointerRef.current++;
      nextEntry = state.strokeHistoryRef.current[state.historyPointerRef.current + 1];
    }

    if (!nextEntry?.isLocal) return null;

    const updates = nextEntry.strokeIds.map((): CRDTUpdateMessage => {
      const strokeId = state.crdtRef.current!.addStroke(nextEntry.drawingData);
      return {
        type: CRDTMessageTypes.UPDATE,
        state: {
          key: strokeId,
          register: state.crdtRef.current!.state[strokeId],
        },
      };
    });

    nextEntry.strokeIds = updates.map((update) => update.state.key);

    state.historyPointerRef.current++;
    state.updateHistoryState();
    operation.redrawCanvas();

    return updates;
  }, [state, operation]);

  const applyDrawing = useCallback(
    (crdtDrawingData: CRDTMessage) => {
      if (!state.crdtRef.current) return;

      if (crdtDrawingData.type === CRDTMessageTypes.SYNC) {
        const updatedKeys = state.crdtRef.current.merge(crdtDrawingData.state as MapState);
        if (updatedKeys.length === 0) return;
        // 전체 동기화 후 캔버스 다시 그리기
        operation.redrawCanvas();

        state.strokeHistoryRef.current = [
          {
            strokeIds: updatedKeys,
            isLocal: false,
            drawingData: state.crdtRef.current.strokes[state.crdtRef.current.strokes.length - 1].stroke,
          },
        ];
        state.historyPointerRef.current = 0;
        state.updateHistoryState();
      } else if (crdtDrawingData.type === CRDTMessageTypes.UPDATE) {
        const { key, register } = crdtDrawingData.state as {
          key: string;
          register: RegisterState<DrawingData | null>;
        };

        const peerId = key.split('-')[0];
        const isLocalUpdate = peerId === state.currentPlayerId;

        if (!state.crdtRef.current.mergeRegister(key, register) || isLocalUpdate) return;
        // 원격 업데이트의 경우 캔버스 다시 그리기
        operation.redrawCanvas();

        const stroke = register[2];
        // stroke가 null이 아닌 경우 (삭제되지 않은 경우) 히스토리 추가
        if (!stroke) return;
        if (state.historyPointerRef.current < state.strokeHistoryRef.current.length - 1) {
          state.strokeHistoryRef.current = state.strokeHistoryRef.current.slice(0, state.historyPointerRef.current + 1);
        }
        state.strokeHistoryRef.current.push({
          strokeIds: [key],
          isLocal: false,
          drawingData: stroke,
        });
        state.historyPointerRef.current++;
        state.updateHistoryState();
      }
    },
    [state.currentPlayerId, operation.redrawCanvas, state.updateHistoryState],
  );

  return {
    currentColor: state.currentColor,
    setCurrentColor: state.setCurrentColor,
    brushSize: state.brushSize,
    setBrushSize: state.setBrushSize,
    drawingMode: state.drawingMode,
    setDrawingMode: state.setDrawingMode,
    inkRemaining: state.inkRemaining,
    canUndo: state.canUndo,
    canRedo: state.canRedo,
    startDrawing,
    draw,
    stopDrawing,
    applyDrawing,
    undo,
    redo,
  };
};
