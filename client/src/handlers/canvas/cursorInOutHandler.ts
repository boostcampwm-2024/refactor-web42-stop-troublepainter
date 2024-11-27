import { RefObject } from 'react';
import { Point } from '@troublepainter/core';
import { getCanvasContext } from '@/utils/getCanvasContext';

const handleInCanvas = (canvasRef: RefObject<HTMLCanvasElement>, point: Point, brushSize: number) => {
  const { canvas, ctx } = getCanvasContext(canvasRef);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.arc(point.x, point.y, brushSize / 2, 0, 2 * Math.PI);
  ctx.stroke();
};

const handleOutCanvas = (canvasRef: RefObject<HTMLCanvasElement>) => {
  const { canvas, ctx } = getCanvasContext(canvasRef);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

export { handleInCanvas, handleOutCanvas };
