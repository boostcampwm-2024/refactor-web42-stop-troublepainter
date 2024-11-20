import { MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent, useCallback, useRef } from 'react';
import { Canvas } from '@/components/canvas/CanvasUI';
import { COLORS_INFO, MAINCANVAS_RESOLUTION_WIDTH } from '@/constants/canvasConstants';
import { useDrawingSocket } from '@/hooks/socket/useDrawingSocket';
import { useCoordinateScale } from '@/hooks/useCoordinateScale';
import { useDrawing } from '@/hooks/useDrawing';
import { CanvasEventHandlers } from '@/types/canvas.types';
import { PlayerRole } from '@/types/gameShared.types';
import { getCanvasContext } from '@/utils/getCanvasContext';
import { getDrawPoint } from '@/utils/getDrawPoint';

interface GameCanvasProps {
  role: PlayerRole;
  maxPixels?: number;
}

/**
 * 게임용 캔버스 컴포넌트입니다.
 *
 * @remarks
 * useDrawing과 useDrawingSocket을 통합하여 실시간 드로잉 기능을 제공합니다.
 * 플레이어의 역할에 따라 드로잉 권한을 관리합니다.
 *
 * @param props - 컴포넌트 props
 * @param props.role - 플레이어 역할 (PAINTER/DEVIL/GUESSER)
 * @param props.maxPixels - 최대 사용 가능 픽셀 수
 *
 * @example
 * ```tsx
 * // GameRoom.tsx에서의 사용 예시
 * const GameRoom = () => {
 *   return (
 *     <div>
 *       <GameCanvas
 *         role={PlayerRole.PAINTER}
 *         maxPixels={100000}
 *       />
 *       <ChatComponent />
 *     </div>
 *   );
 * };
 * ```
 *
 * @category Components
 */
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
    applyDrawing,
    getCurrentDrawing,
    canUndo,
    canRedo,
    undo,
    redo,
  } = useDrawing(canvasRef, {
    maxPixels,
  });

  const { isConnected, sendDrawing } = useDrawingSocket({
    onDrawUpdate: (response) => {
      if (response.drawingData) {
        applyDrawing(response.drawingData);
      }
    },
  });

  const handleDrawStart = useCallback(
    (e: ReactMouseEvent<HTMLCanvasElement> | ReactTouchEvent<HTMLCanvasElement>) => {
      const { canvas } = getCanvasContext(canvasRef);
      const point = getDrawPoint(e, canvas);
      const convertPoint = convertCoordinate(point);
      startDrawing(convertPoint);
    },
    [startDrawing, convertCoordinate],
  );

  const handleDrawMove = useCallback(
    (e: ReactMouseEvent<HTMLCanvasElement> | ReactTouchEvent<HTMLCanvasElement>) => {
      const { canvas } = getCanvasContext(canvasRef);
      const point = getDrawPoint(e, canvas);
      const convertPoint = convertCoordinate(point);
      draw(convertPoint);
    },
    [draw, convertCoordinate],
  );

  const handleDrawEnd = useCallback(() => {
    const currentDrawing = getCurrentDrawing();
    // console.log(currentDrawing, isConnected);
    if (currentDrawing && isConnected) {
      // console.log(currentDrawing);
      sendDrawing(currentDrawing);
    }
    stopDrawing();
  }, [stopDrawing, sendDrawing, getCurrentDrawing, isConnected]);

  const isDrawableRole = (role: PlayerRole): role is PlayerRole.PAINTER | PlayerRole.DEVIL => {
    return role === 'PAINTER' || role === 'DEVIL';
  };

  const isDrawable = isDrawableRole(role);

  const COLORS = COLORS_INFO.map((color) => ({
    ...color,
    isSelected: currentColor === color.backgroundColor,
    onClick: () => setCurrentColor(color.backgroundColor),
  }));

  const canvasEventHandlers: CanvasEventHandlers = {
    onMouseDown: handleDrawStart,
    onMouseMove: handleDrawMove,
    onMouseUp: handleDrawEnd,
    onMouseLeave: handleDrawEnd,
    onTouchStart: handleDrawStart,
    onTouchMove: handleDrawMove,
    onTouchEnd: handleDrawEnd,
    onTouchCancel: handleDrawEnd,
  };

  return (
    <Canvas
      canvasRef={canvasRef}
      isDrawable={isDrawable}
      colors={isDrawable ? COLORS : []}
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
    />
  );
};

export { GameCanvas };
