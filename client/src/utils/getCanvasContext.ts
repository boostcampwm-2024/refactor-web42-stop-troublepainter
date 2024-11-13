import { RefObject } from 'react';

interface CanvasContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

// Canvas 컨텍스트를 안전하게 가져오는 유틸리티 함수
export const getCanvasContext = (canvasRef: RefObject<HTMLCanvasElement>): CanvasContext => {
  const canvas = canvasRef.current;
  if (!canvas) throw new Error('Canvas 요소를 찾지 못했습니다.');

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D context를 가져오는데 실패했습니다.');

  return { canvas, ctx };
};
