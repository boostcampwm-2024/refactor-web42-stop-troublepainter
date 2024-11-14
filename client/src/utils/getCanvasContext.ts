import { RefObject } from 'react';

interface CanvasContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

/**
 * Canvas 컨텍스트를 안전하게 가져오는 유틸리티 함수입니다.
 *
 * - canvas 객체를 담은 RefObject 객체를 매개변수로 넘기면 canvas객체와 Context2D 객체를 반환합니다.
 * - canvas 객체가 정상적으로 생성되지 않았을 경우 에러를 던집니다.
 *
 * @param canvasRef - canvas 객체를 담은 RefObject 객체
 * @returns canvas와 Context2D가 포함된 객체
 * @throws {Error} canvas 객체가 정상적으로 생성되지 않았을 경우
 *
 * @example
 * ```typescript
 * const { canvas, ctx } = getCanvasContext(canvasRef);
 * ```
 *
 * @category Utils
 */
export const getCanvasContext = (canvasRef: RefObject<HTMLCanvasElement>): CanvasContext => {
  const canvas = canvasRef.current;
  if (!canvas) throw new Error('Canvas 요소를 찾지 못했습니다.');

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D context를 가져오는데 실패했습니다.');

  return { canvas, ctx };
};
