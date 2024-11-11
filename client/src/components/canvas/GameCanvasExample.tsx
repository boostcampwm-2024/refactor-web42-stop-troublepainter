import { MouseEvent, TouchEvent, useCallback, useRef } from 'react';
import { Canvas } from '@/components/canvas/CanvasUI';
import { useDrawing } from '@/hooks/useDrawing';
import { UserRole, PainterRole } from '@/types/userInfo.types';

interface GameCanvasProps {
  role: UserRole;
  maxPixels?: number;
}

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

  const handleMouseDown = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      startDrawing({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    [startDrawing],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      draw({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    [draw],
  );

  const handleTouchStart = useCallback(
    (e: TouchEvent<HTMLElement>) => {
      e.preventDefault();
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const touch = e.touches[0];
      startDrawing({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      });
    },
    [startDrawing],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent<HTMLElement>) => {
      e.preventDefault();
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const touch = e.touches[0];
      draw({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      });
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
      // canvas 태그 기본 속성
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={stopDrawing}
    />
  );
};

export { GameCanvas };
