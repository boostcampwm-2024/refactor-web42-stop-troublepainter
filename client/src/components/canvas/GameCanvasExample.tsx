import { MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent, useCallback, useRef } from 'react';
import { Canvas } from '@/components/canvas/CanvasUI';
import { useDrawing } from '@/hooks/useDrawing';
import { CanvasEventHandlers } from '@/types/canvas.types';
import { UserRole, PainterRole } from '@/types/userInfo.types';

interface GameCanvasProps {
  role: UserRole;
  maxPixels?: number;
}

const getTouchPoint = (canvas: HTMLCanvasElement, e: TouchEvent) => {
  const { clientX, clientY } = e.touches[0]; //뷰포트 기준
  const { top, left } = canvas.getBoundingClientRect(); // 캔버스의 뷰포트 기준 위치
  return { x: clientX - left, y: clientY - top };
};

const getDrawPoint = (
  e: ReactTouchEvent<HTMLCanvasElement> | ReactMouseEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement,
) => {
  if (!canvas) new Error('canvas element가 없습니다.');

  if (e.nativeEvent instanceof MouseEvent) return { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
  else if (e.nativeEvent instanceof TouchEvent) return getTouchPoint(canvas, e.nativeEvent);
  else throw new Error('mouse 혹은 touch 이벤트가 아닙니다.');
};

const GameCanvas = ({ role, maxPixels = 100000 }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
  const isDrawableRole = (role: UserRole): role is PainterRole => {
    return role === '그림꾼' || role === '방해꾼';
  };

  const handleDrawStart = useCallback(
    (e: ReactMouseEvent<HTMLCanvasElement> | ReactTouchEvent<HTMLCanvasElement>) => {
      if (canvasRef.current) startDrawing(getDrawPoint(e, canvasRef.current));
    },
    [startDrawing],
  );

  const handleDrawMove = useCallback(
    (e: ReactMouseEvent<HTMLCanvasElement> | ReactTouchEvent<HTMLCanvasElement>) => {
      if (canvasRef.current) draw(getDrawPoint(e, canvasRef.current));
    },
    [draw],
  );

  const COLORS = [
    { color: '검정', backgroundColor: '#000000', isSelected: currentColor === '#000000' },
    { color: '분홍', backgroundColor: '#FF69B4', isSelected: currentColor === '#FF69B4' },
    { color: '노랑', backgroundColor: '#FFFF00', isSelected: currentColor === '#FFFF00' },
    { color: '하늘', backgroundColor: '#87CEEB', isSelected: currentColor === '#87CEEB' },
    { color: '회색', backgroundColor: '#808080', isSelected: currentColor === '#808080' },
  ].map((color) => ({
    ...color,
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
      className="min-w-[280px]"
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
