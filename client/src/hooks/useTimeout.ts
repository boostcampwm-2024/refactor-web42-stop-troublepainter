import { useEffect } from 'react';

export function useTimeout(callback: () => void, delay: number) {
  useEffect(() => {
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsedTime = Date.now() - startTime;

      if (elapsedTime >= delay) {
        clearInterval(timer);
        callback();
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [callback, delay]);
}
