import { useEffect, useRef } from 'react';
import { TimerType } from '@troublepainter/core';
import { useGameSocketStore } from '@/stores/socket/gameSocket.store';

export const useTimer = () => {
  const actions = useGameSocketStore((state) => state.actions);
  const timers = useGameSocketStore((state) => state.timers);

  const intervalRefs = useRef<Record<TimerType, NodeJS.Timeout | null>>({
    [TimerType.DRAWING]: null,
    [TimerType.GUESSING]: null,
    [TimerType.ENDING]: null,
  });

  useEffect(() => {
    const manageTimer = (timerType: TimerType, value: number | null) => {
      // 이전 인터벌 정리
      if (intervalRefs.current[timerType]) {
        clearInterval(intervalRefs.current[timerType]!);
        intervalRefs.current[timerType] = null;
      }

      // 새로운 타이머 설정
      if (value !== null && value > 0) {
        intervalRefs.current[timerType] = setInterval(() => {
          actions.decreaseTimer(timerType);
        }, 1000);
      }
    };

    // 각 타이머 타입에 대해 처리
    Object.entries(timers).forEach(([type, value]) => {
      if (type in TimerType) {
        manageTimer(type as TimerType, value);
      }
    });

    // 클린업
    return () => {
      Object.values(intervalRefs.current).forEach((interval) => {
        if (interval) clearInterval(interval);
      });
    };
  }, [timers, actions]); // timers와 actions만 의존성으로 설정

  return timers;
};
