import { RefObject, useCallback, useEffect, useRef } from 'react';

export const useCoordinateScale = (resolution_width: number, canvas: RefObject<HTMLCanvasElement>) => {
  const coordinateScale = useRef(1);
  const resizeObserver = useRef<ResizeObserver | null>(null);

  const handleResizeCanvas = useCallback((entires: ResizeObserverEntry[]) => {
    const canvas = entires[0].target;
    coordinateScale.current = resolution_width / canvas.getBoundingClientRect().width;
  }, []);

  useEffect(() => {
    if (!canvas.current) return;

    coordinateScale.current = resolution_width / canvas.current.getBoundingClientRect().width;
    resizeObserver.current = new ResizeObserver(handleResizeCanvas);
    resizeObserver.current.observe(canvas.current);

    return () => {
      if (resizeObserver.current) resizeObserver.current.disconnect();
    };
  }, []);

  return coordinateScale;
};
