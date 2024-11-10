import { useRef, TouchEvent, MouseEvent } from 'react';
import { CANVAS_EVENT } from '@/constants/canvasConstants';
import { useCanvasStore } from '@/stores/useCanvasStore';
import { CanvasStore } from '@/types/canvas.types';

const CANVAS_SIZE_WIDTH = 640; //임시 사이즈
const CANVAS_SIZE_HEIGHT = 420;

const getTouchPoint = (canvas: HTMLCanvasElement, e: TouchEvent<HTMLCanvasElement>) => {
  const { clientX, clientY } = e.nativeEvent.touches[0]; //뷰포트 기준
  const { top, left } = canvas.getBoundingClientRect(); // 캔버스의 뷰포트 기준 위치
  return [clientX - left, clientY - top];
};

const getDrawPoint = (e: TouchEvent<HTMLCanvasElement> | MouseEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement) => {
  if (!canvas) new Error('canvas element가 없습니다.');

  if (e.type === CANVAS_EVENT.MOUSE_DOWN || e.type === CANVAS_EVENT.MOUSE_MOVE) {
    const event = e as MouseEvent<HTMLCanvasElement>;
    return [event.nativeEvent.offsetX, event.nativeEvent.offsetY];
  } else if (e.type === CANVAS_EVENT.TOUCH_DOWN || e.type === CANVAS_EVENT.TOUCH_MOVE) {
    const event = e as TouchEvent<HTMLCanvasElement>;
    return getTouchPoint(canvas, event);
  } else {
    throw new Error('mouse 혹은 touch 이벤트가 아닙니다.');
  }
};

export const MainCanvas = () => {
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const canDrawing = useCanvasStore((state: CanvasStore) => state.canDrawing);
  const setCanDrawing = useCanvasStore((state: CanvasStore) => state.action.setCanDrawing);

  const drawStartPath = (ctx: CanvasRenderingContext2D, drawX: number, drawY: number) => {
    ctx.beginPath();

    ctx.arc(drawX, drawY, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(drawX, drawY);
  };

  const startDrawingEvent = (e: TouchEvent<HTMLCanvasElement> | MouseEvent<HTMLCanvasElement>) => {
    if (canDrawing) return;
    if (!mainCanvasRef.current) return;

    const canvas = mainCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const [drawX, drawY] = getDrawPoint(e, canvas);
      drawStartPath(ctx, drawX, drawY);
    } catch (err) {
      console.error(err);
    }

    setCanDrawing(true);
  };

  const drawingEvent = (e: TouchEvent<HTMLCanvasElement> | MouseEvent<HTMLCanvasElement>) => {
    if (!canDrawing) return;
    if (!mainCanvasRef.current) return;

    const canvas = mainCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const [drawX, drawY] = getDrawPoint(e, canvas);
      ctx.lineTo(drawX, drawY);
      ctx.stroke();
    } catch (err) {
      console.error(err);
    }
  };

  const stopDrawingEvent = () => {
    setCanDrawing(false);
  };

  return (
    <section>
      <canvas
        className="touch-none border border-black"
        ref={mainCanvasRef}
        width={CANVAS_SIZE_WIDTH}
        height={CANVAS_SIZE_HEIGHT}
        onMouseDown={startDrawingEvent}
        onTouchStart={startDrawingEvent}
        onMouseMove={drawingEvent}
        onTouchMove={drawingEvent}
        onMouseUp={stopDrawingEvent}
        onMouseLeave={stopDrawingEvent}
        onTouchEnd={stopDrawingEvent}
        onTouchCancel={stopDrawingEvent}
      >
        <img src="/" /> {/* canvas 지원하지 않는 브라우저일 경우 대체 이미지 */}
      </canvas>
    </section>
  );
};
