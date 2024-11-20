import { RefObject, useCallback, useEffect, useRef } from 'react';
import { Point } from '@/types/drawingShared.types';

/**
 * 캔버스 크기 변경 시 사용하는 hook입니다.
 * 드로잉 좌표를 올바른 곳에 맞춰주는 조정값을 계산하여 RefObject 객체로 반환해줍니다.
 *
 * - 리턴 배열의 첫 번째 인자는 조정값이며, 두 번째 인자는 조정값을 곱한 계산 좌표를 구해주는 콜백입니다.
 *
 * @param resolutionWidth - 해당소 width 크기를 받습니다.
 * @param canvas - 조정값 계산을 적용할 canvas RefObject 객체를 받습니다.
 * @returns [RefObject<number> 조정값, 조정값 반영 함수]
 *
 * @example
 * - hook 호출부
 * ```typescript
 * const [coordinateScaleRef, convertCoordinate] = useCoordinateScale(MAINCANVAS_RESOLUTION_WIDTH, mainCanvasRef);
 * ```
 * - 조정값 사용
 * ```typescript
 * const [drawX, drawY] = convertCoordinate(getDrawPoint(e, canvas));
 * ```
 * @category Hooks
 */

export const useCoordinateScale = (resolutionWidth: number, canvas: RefObject<HTMLCanvasElement>) => {
  const coordinateScale = useRef(1);
  const resizeObserver = useRef<ResizeObserver | null>(null);

  const handleResizeCanvas = useCallback((entires: ResizeObserverEntry[]) => {
    const canvas = entires[0].target;
    coordinateScale.current = resolutionWidth / canvas.getBoundingClientRect().width;
  }, []);

  useEffect(() => {
    if (!canvas.current) return;

    coordinateScale.current = resolutionWidth / canvas.current.getBoundingClientRect().width;
    resizeObserver.current = new ResizeObserver(handleResizeCanvas);
    resizeObserver.current.observe(canvas.current);

    return () => {
      if (resizeObserver.current) resizeObserver.current.disconnect();
    };
  }, []);

  const convertCoordinate = ({ x, y }: Point): Point => {
    return { x: x * coordinateScale.current, y: y * coordinateScale.current };
  };

  return { coordinateScale, convertCoordinate };
};
