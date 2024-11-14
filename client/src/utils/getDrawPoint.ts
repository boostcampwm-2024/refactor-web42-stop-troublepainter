import { TouchEvent as ReactTouchEvent, MouseEvent as ReactMouseEvent } from 'react';
import { Point } from '@/types/canvas.types';

/**
 * TouchEvent에서 첫 번째 터치 좌표를 가져오는 Util 함수입니다.
 * - 이벤트 객체와 캔버스 객체를 매개변수로 받아, 캔버스 Element 요소 크기 기준의 상대 좌표를 반환합니다.
 *
 * @param e - TouchEvent 객체
 * @param canvas - HTMLCanvasElement 객체
 * @returns 사용자 정의 Point 타입 객체
 *
 * @example
 * ```typescript
 * if (e.nativeEvent instanceof TouchEvent) return getTouchPoint(canvas, e.nativeEvent);
 * ```
 *
 * @category Utils
 */
const getTouchPoint = (canvas: HTMLCanvasElement, e: TouchEvent): Point => {
  const { clientX, clientY } = e.touches[0];
  const { top, left } = canvas.getBoundingClientRect();
  return { x: clientX - left, y: clientY - top };
};

/**
 * Canvas 클릭 혹은 터치 좌표를 가져오는 Util 함수입니다.
 * - 이벤트 객체와 캔버스 객체를 매개변수로 받아, 캔버스 Element 요소 크기 기준의 상대 좌표를 반환합니다.
 * - 좌표는 캔버스 좌측 상단이 (0,0) 입니다.
 *
 * @param e - MouseEvent 혹은 TouchEvent
 * @param canvas - HTMLCanvasElement 객체
 * @returns 사용자 정의 Point 타입 객체
 * @throws {Error} 인자 e가 MouseEvent나 TouchEvent가 아닐 경우 에러를 던집니다.
 *
 * @example
 * ```typescript
 * const canvas = canvasRef.current;
 * if (canvas.current) const {x, y} = getDrawPoint(e, canvas.current);
 * ```
 *
 * @category Utils
 */
export const getDrawPoint = (
  e: ReactTouchEvent<HTMLCanvasElement> | ReactMouseEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement,
): Point => {
  if (e.nativeEvent instanceof MouseEvent) return { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
  else if (e.nativeEvent instanceof TouchEvent) return getTouchPoint(canvas, e.nativeEvent);
  else throw new Error('mouse 혹은 touch 이벤트가 아닙니다.');
};
