import { RefObject, useCallback, useEffect, useRef } from 'react';
import { useEffect, useState } from 'react';

/**
 * 캔버스 크기 변경 시 사용하는 hook입니다.
 * 드로잉 좌표를 올바른 곳에 맞춰주는 조정값을 계산하여 RefObject 객체로 반환해줍니다.
 *
 * @param resolutionWidth - 해당소 width 크기를 받습니다.
 * @param canvas - 조정값 계산을 적용할 canvas RefObject 객체를 받습니다.
 * @returns RefObject<number> 조정값. 드로잉 좌표에 곱해주면 됩니다.
 *
 * @example
 * - hook 호출부
 * ```typescript
 * const coordinateScaleRef = useCoordinateScale(MAINCANVAS_RESOLUTION_WIDTH, mainCanvasRef);
 * ```
 * - 조정값 사용
 * ```typescript
 * const convertCoordinate = ([x, y]: number[]): number[] => {
 *  return [x * coordinateScaleRef.current, y * coordinateScaleRef.current];
 * };
 * ...
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

  return coordinateScale;
};
