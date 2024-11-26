import { useEffect, useRef } from 'react';

/**
 * `setInterval`을 사용하여 타이머를 관리하는 커스텀 React 훅입니다.
 * 유효한 `timer` 값이 전달되면 타이머가 시작되며, `timer`가 `null`이 되거나 0 이하가 되면 타이머가 중지됩니다.
 *
 * @param {UseTimerProps} props - 타이머 설정을 위한 속성입니다.
 * @param {number | null} props.timer - 현재 타이머 값입니다. `null`이거나 0 이하일 경우 타이머가 중지됩니다.
 * @param {() => void} props.onTick - 매 1초 간격으로 호출되는 콜백 함수입니다.
 *
 * @example
 * ```tsx
 * import { useState } from "react";
 * import { useTimer } from "./useTimer";
 *
 * const TimerComponent = () => {
 *   const [timer, setTimer] = useState(10); // 초기 타이머 값 설정
 *
 *   // useTimer 훅 사용
 *   useTimer({
 *     timer,
 *     onTick: () => setTimer(prev => prev - 1), // 매 초 타이머 값을 감소
 *   });
 *
 *   return (
 *     <div>
 *       <h1>남은 시간: {timer}</h1>
 *     </div>
 *   );
 * };
 * ```
 */

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
