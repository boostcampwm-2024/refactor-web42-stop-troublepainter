import { MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent, useCallback, useRef } from 'react';
import { Canvas } from '@/components/canvas/CanvasUI';
import { COLORS_INFO, MAINCANVAS_RESOLUTION_WIDTH } from '@/constants/canvasConstants';
import { useCoordinateScale } from '@/hooks/useCoordinateScale';
import { useDrawing } from '@/hooks/useDrawing';
import { CanvasEventHandlers } from '@/types/canvas.types';
import { PlayerRole } from '@/types/game.types';
import { getCanvasContext } from '@/utils/getCanvasContext';
import { getDrawPoint } from '@/utils/getDrawPoint';

interface GameCanvasProps {
  role: PlayerRole;
  maxPixels?: number;
}

const GameCanvas = ({ role, maxPixels = 100000 }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { convertCoordinate } = useCoordinateScale(MAINCANVAS_RESOLUTION_WIDTH, canvasRef);

  const {
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
    canUndo,
    canRedo,
    undo,
    redo,
  } = useDrawing(canvasRef, {
    maxPixels,
  });

  // PainterRole 타입 가드
  const isDrawableRole = (role: PlayerRole): role is PlayerRole.PAINTER | PlayerRole.DEVIL => {
    return role === 'PAINTER' || role === 'DEVIL';
  };

  const handleDrawStart = useCallback(
    (e: ReactMouseEvent<HTMLCanvasElement> | ReactTouchEvent<HTMLCanvasElement>) => {
      const { canvas } = getCanvasContext(canvasRef);
      const point = getDrawPoint(e, canvas);
      const convertPoint = convertCoordinate(point);
      startDrawing(convertPoint);
    },
    [startDrawing],
  );

  const handleDrawMove = useCallback(
    (e: ReactMouseEvent<HTMLCanvasElement> | ReactTouchEvent<HTMLCanvasElement>) => {
      const { canvas } = getCanvasContext(canvasRef);
      const point = getDrawPoint(e, canvas);
      const convertPoint = convertCoordinate(point);
      draw(convertPoint);
    },
    [draw],
  );

  const COLORS = COLORS_INFO.map((color) => ({
    ...color,
    isSelected: currentColor === color.backgroundColor,
    onClick: () => setCurrentColor(color.backgroundColor),
  }));

  const isDrawable = isDrawableRole(role);

  const canvasEventHandlers: CanvasEventHandlers = {
    onMouseDown: handleDrawStart,
    onMouseMove: handleDrawMove,
    onMouseUp: stopDrawing,
    onMouseLeave: stopDrawing,
    onTouchStart: handleDrawStart,
    onTouchMove: handleDrawMove,
    onTouchEnd: stopDrawing,
    onTouchCancel: stopDrawing,
  };

  return (
    <Canvas
      canvasRef={canvasRef}
      isDrawable={isDrawable}
      colors={isDrawable ? COLORS : []}
      // toolbarPosition="floating"
      brushSize={brushSize}
      setBrushSize={setBrushSize}
      drawingMode={drawingMode}
      onDrawingModeChange={setDrawingMode}
      inkRemaining={inkRemaining}
      maxPixels={maxPixels}
      canUndo={canUndo}
      canRedo={canRedo}
      onUndo={undo}
      onRedo={redo}
      canvasEvents={canvasEventHandlers}
      // canvas 태그 기본 속성
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      onTouchEnd={stopDrawing}
      onTouchCancel={stopDrawing}
    />
  );
};

export { GameCanvas };
