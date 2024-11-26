import { useEffect, useRef } from 'react';

interface UseTimerProps {
  timer: number | null;
  onTick: () => void;
}

export const useTimer = ({ timer, onTick }: UseTimerProps) => {
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timer !== null && timer > 0 && !intervalIdRef.current) {
      intervalIdRef.current = setInterval(onTick, 1000);
    } else if ((timer === null || timer <= 0) && intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [timer !== null && timer > 0]);
};
