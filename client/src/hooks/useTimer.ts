import { useEffect, useRef } from 'react';
import { TimerType } from '@troublepainter/core';
import { useTimerStore } from '@/stores/timer.store';

export const useTimer = () => {
  const actions = useTimerStore((state) => state.actions);
  const timers = useTimerStore((state) => state.timers);

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
  }, [
    timers.DRAWING !== null && timers.DRAWING > 0,
    timers.GUESSING !== null && timers.GUESSING > 0,
    timers.ENDING !== null && timers.ENDING > 0,
    actions,
  ]); // timers와 actions만 의존성으로 설정

  return timers;
};
