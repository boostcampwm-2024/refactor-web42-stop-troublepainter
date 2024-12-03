import { useEffect } from 'react';

/**
 * 지정된 시간이 지난 후 콜백 함수를 실행하는 커스텀 훅입니다.
 * setTimeout과 유사하게 동작하지만 더 정확한 타이밍을 위해 내부적으로 setInterval을 사용합니다.
 *
 * @param callback - 지연 시간 후 실행할 함수
 * @param delay - 콜백 실행 전 대기할 시간 (밀리초)
 *
 * @example
 * ```tsx
 * // 5초 후에 콜백 실행
 * useTimeout(() => {
 *   console.log('5초가 지났습니다');
 * }, 5000);
 * ```
 *
 * @remarks
 * - 경과 시간을 확인하기 위해 내부적으로 setInterval을 사용합니다
 * - 컴포넌트 언마운트 시 자동으로 정리(cleanup)됩니다
 * - callback이나 delay가 변경되면 타이머가 재설정됩니다
 *
 * @category Hooks
 */

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
