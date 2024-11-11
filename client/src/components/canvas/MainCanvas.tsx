import { useRef, TouchEvent as ReactTouchEvent, MouseEvent as ReactMouseEvent } from 'react';
import { PENMODE } from '@/constants/canvasConstants';
import { useCanvasStore } from '@/stores/useCanvasStore';
import { CanvasStore } from '@/types/canvas.types';

const CANVAS_SIZE_WIDTH = 640; //임시 사이즈
const CANVAS_SIZE_HEIGHT = 420;

const CV = ['#000', '#f257c9', '#e2f724', '#4eb4c2', '#d9d9d9'];
//임시 색상 배열

const getTouchPoint = (canvas: HTMLCanvasElement, e: TouchEvent) => {
  const { clientX, clientY } = e.touches[0]; //뷰포트 기준
  const { top, left } = canvas.getBoundingClientRect(); // 캔버스의 뷰포트 기준 위치
  return [clientX - left, clientY - top];
};

const getDrawPoint = (
  e: ReactTouchEvent<HTMLCanvasElement> | ReactMouseEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement,
) => {
  if (!canvas) new Error('canvas element가 없습니다.');

  if (e.nativeEvent instanceof MouseEvent) return [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
  else if (e.nativeEvent instanceof TouchEvent) return getTouchPoint(canvas, e.nativeEvent);
  else throw new Error('mouse 혹은 touch 이벤트가 아닙니다.');
};

const MainCanvas = () => {
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const canDrawing = useCanvasStore((state: CanvasStore) => state.canDrawing);
  const setCanDrawing = useCanvasStore((state: CanvasStore) => state.action.setCanDrawing);
  const penSetting = useCanvasStore((state: CanvasStore) => state.penSetting);

  const drawStartPath = (ctx: CanvasRenderingContext2D, drawX: number, drawY: number) => {
    ctx.beginPath();
    ctx.fillStyle = CV[penSetting.colorNum];
    ctx.strokeStyle = CV[penSetting.colorNum];
    ctx.lineWidth = penSetting.lineWidth;

    ctx.arc(drawX, drawY, penSetting.lineWidth / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(drawX, drawY);
  };

  const handleStartDrawingEvent = (e: ReactTouchEvent<HTMLCanvasElement> | ReactMouseEvent<HTMLCanvasElement>) => {
    if (canDrawing) return;
    if (!mainCanvasRef.current) return;

    const canvas = mainCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const [drawX, drawY] = getDrawPoint(e, canvas);
      drawStartPath(ctx, drawX, drawY);
    } catch (err) {
      throw err;
    }

    setCanDrawing(true);
  };

  const handleDrawingEvent = (e: ReactTouchEvent<HTMLCanvasElement> | ReactMouseEvent<HTMLCanvasElement>) => {
    if (!canDrawing || penSetting.mode === PENMODE.PAINTER) return;
    if (!mainCanvasRef.current) return;

    const canvas = mainCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const [drawX, drawY] = getDrawPoint(e, canvas);
      ctx.lineTo(drawX, drawY);
      ctx.stroke();
    } catch (err) {
      throw err;
    }
  };

  const handleStopDrawingEvent = () => {
    setCanDrawing(false);
  };

  return (
    <section>
      <canvas
        className="touch-none border border-black"
        ref={mainCanvasRef}
        width={CANVAS_SIZE_WIDTH}
        height={CANVAS_SIZE_HEIGHT}
        onMouseDown={handleStartDrawingEvent}
        onTouchStart={handleStartDrawingEvent}
        onMouseMove={handleDrawingEvent}
        onTouchMove={handleDrawingEvent}
        onMouseUp={handleStopDrawingEvent}
        onMouseLeave={handleStopDrawingEvent}
        onTouchEnd={handleStopDrawingEvent}
        onTouchCancel={handleStopDrawingEvent}
      >
        <img src="/" /> {/* canvas 지원하지 않는 브라우저일 경우 대체 이미지 */}
      </canvas>
    </section>
  );
};

export default MainCanvas;
