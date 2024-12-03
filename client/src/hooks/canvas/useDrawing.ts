import { RefObject, useCallback, useRef } from 'react';
import {
  Point,
  CRDTMessage,
  CRDTMessageTypes,
  CRDTUpdateMessage,
  CRDTSyncMessage,
  RoomStatus,
  DrawingData,
} from '@troublepainter/core';
import { useDrawingOperation } from './useDrawingOperation';
import { useDrawingState } from './useDrawingState';
import { DRAWING_MODE } from '@/constants/canvasConstants';

export const useDrawing = (
  canvasRef: RefObject<HTMLCanvasElement>,
  roomStatus: RoomStatus,
  options?: { maxPixels?: number },
) => {
  const state = useDrawingState(options);
  const operation = useDrawingOperation(canvasRef, state);
  const currentDrawingPoints = useRef<Point[]>([]);

  const createDrawingData = useCallback(
    (points: Point[]): DrawingData => ({
      points,
      style: operation.getCurrentStyle(),
      timestamp: Date.now(),
    }),
    [operation],
  );

  const renderStroke = useCallback(
    (strokeData: DrawingData, position: 'middle' | 'end') => {
      if (position === 'middle') {
        operation.redrawCanvas();
      } else {
        if (strokeData.points.length > 2) {
          operation.applyFill(strokeData);
        } else {
          operation.drawStroke(strokeData);
        }
      }
    },
    [operation],
  );

  const startDrawing = useCallback(
    (point: Point): CRDTUpdateMessage | null => {
      if (state.checkInkAvailability() === false || !state.crdtRef.current) return null;

      state.currentStrokeIdsRef.current = [];
      currentDrawingPoints.current = state.drawingMode === DRAWING_MODE.PEN ? [point] : [];

      const drawingData =
        state.drawingMode === DRAWING_MODE.FILL
          ? operation.floodFill(Math.floor(point.x), Math.floor(point.y))
          : createDrawingData([point]);

      if (!drawingData) return null;

      const { id, position } = state.crdtRef.current.addStroke(drawingData);
      state.currentStrokeIdsRef.current.push(id);
      renderStroke(drawingData, position);

      return {
        type: CRDTMessageTypes.UPDATE,
        state: {
          key: id,
          register: state.crdtRef.current.state[id],
        },
      };
    },
    [state, operation, createDrawingData, renderStroke],
  );

  const continueDrawing = useCallback(
    (point: Point): CRDTUpdateMessage | null => {
      if (!state.crdtRef.current || currentDrawingPoints.current.length === 0 || state.inkRemaining <= 0) return null;
      if (state.drawingMode === DRAWING_MODE.FILL) return null;

      const lastPoint = currentDrawingPoints.current[currentDrawingPoints.current.length - 1];
      if (lastPoint.x === point.x && lastPoint.y === point.y) return null;

      const pixelsUsed = Math.ceil(
        Math.sqrt(Math.pow(point.x - lastPoint.x, 2) + Math.pow(point.y - lastPoint.y, 2)) * state.brushSize,
      );
      state.setInkRemaining((prev: number) => Math.max(0, prev - pixelsUsed));

      currentDrawingPoints.current.push(point);
      const drawingData = createDrawingData([...currentDrawingPoints.current]);

      const { id, position } = state.crdtRef.current.addStroke(drawingData);
      state.currentStrokeIdsRef.current.push(id);
      renderStroke(drawingData, position);

      currentDrawingPoints.current = [point];

      return {
        type: CRDTMessageTypes.UPDATE,
        state: {
          key: id,
          register: state.crdtRef.current.state[id],
        },
      };
    },
    [state, createDrawingData, renderStroke],
  );

  const stopDrawing = useCallback(() => {
    if (!state.crdtRef.current || state.currentStrokeIdsRef.current.length === 0) return;

    if (state.historyPointerRef.current < state.strokeHistoryRef.current.length - 1) {
      state.strokeHistoryRef.current = state.strokeHistoryRef.current.slice(0, state.historyPointerRef.current + 1);
    }

    const firstStroke = state.crdtRef.current.strokes.find((s) => s.id === state.currentStrokeIdsRef.current[0]);
    if (!firstStroke) return;

    state.strokeHistoryRef.current.push({
      strokeIds: [...state.currentStrokeIdsRef.current],
      isLocal: true,
      drawingData: firstStroke.stroke,
      timestamp: firstStroke.stroke.timestamp,
    });

    state.historyPointerRef.current = state.strokeHistoryRef.current.length - 1;
    currentDrawingPoints.current = [];
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
      state.crdtRef.current!.deactivateStroke(strokeId);
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

    if (!nextEntry?.isLocal || !nextEntry.drawingData) return null;

    const updates = nextEntry.strokeIds.map((strokeId): CRDTUpdateMessage => {
      state.crdtRef.current!.activateStroke(strokeId);
      return {
        type: CRDTMessageTypes.UPDATE,
        state: {
          key: strokeId,
          register: state.crdtRef.current!.state[strokeId],
        },
      };
    });

    state.historyPointerRef.current++;
    state.updateHistoryState();
    operation.redrawCanvas();

    return updates;
  }, [state, operation]);

  const applyDrawing = useCallback(
    (crdtDrawingData: CRDTMessage) => {
      if (!state.crdtRef.current) return;

      if (crdtDrawingData.type === CRDTMessageTypes.SYNC) {
        const { requiresRedraw } = state.crdtRef.current.merge(crdtDrawingData.state);
        if (requiresRedraw) {
          operation.redrawCanvas();
        }

        if (roomStatus === 'DRAWING') {
          state.strokeHistoryRef.current = [];
          state.historyPointerRef.current = -1;
          state.updateHistoryState();
        }
      } else if (crdtDrawingData.type === CRDTMessageTypes.UPDATE) {
        const { key, register } = crdtDrawingData.state;
        const peerId = key.split('-')[0];
        const isLocalUpdate = peerId === state.currentPlayerId;

        if (isLocalUpdate) return;

        const { updated, position } = state.crdtRef.current.mergeRegister(key, register);
        if (!updated) return;

        const stroke = register[2];

        // null인 경우는 undo된 상태
        if (stroke === null) {
          operation.redrawCanvas(); // 전체 다시 그리기
          return;
        }

        if (position === 'middle') {
          operation.redrawCanvas();
        } else {
          if (stroke.points.length > 2) {
            operation.applyFill(stroke);
          } else {
            operation.drawStroke(stroke);
          }
        }

        state.strokeHistoryRef.current.push({
          strokeIds: [key],
          isLocal: false,
          drawingData: stroke,
          timestamp: stroke.timestamp || Date.now(),
        });

        // 원격 작업은 히스토리 포인터에 영향을 주지 않음
        state.updateHistoryState();
      }
    },
    [state.currentPlayerId, operation, roomStatus],
  );

  const getAllDrawingData = useCallback((): CRDTSyncMessage | null => {
    if (!state.crdtRef.current) return null;

    return {
      type: CRDTMessageTypes.SYNC,
      state: state.crdtRef.current.state,
    };
  }, [state.crdtRef]);

  const resetCanvas = useCallback(() => {
    state.resetDrawingState();
    operation.clearCanvas();
  }, [state.resetDrawingState, operation.clearCanvas]);

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
    continueDrawing,
    stopDrawing,
    applyDrawing,
    undo,
    redo,
    getAllDrawingData,
    resetCanvas,
  };
};
