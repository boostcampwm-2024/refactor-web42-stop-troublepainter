import { MutableRefObject, RefObject, useCallback, useEffect, useRef } from 'react';
import { MAINCANVAS_RESOLUTION_WIDTH as RES_WIDTH } from '@/constants/canvasConstants';

export const useCoordinateScale = (scaleRef: MutableRefObject<number>, canvas: RefObject<HTMLCanvasElement>) => {
  const resizeObserver = useRef<ResizeObserver | null>(null);

  const handleResizeCanvas = useCallback((entires: ResizeObserverEntry[]) => {
    const canvas = entires[0].target;
    scaleRef.current = canvas.getBoundingClientRect().width / RES_WIDTH;
  }, []);

  useEffect(() => {
    resizeObserver.current = new ResizeObserver(handleResizeCanvas);

    if (canvas.current) resizeObserver.current.observe(canvas.current);
    return () => {
      if (resizeObserver.current) resizeObserver.current.disconnect();
    };
  }, []);
};
