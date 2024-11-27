import { useEffect, useRef } from 'react';
import { TimerType } from '@troublepainter/core';
import { useGameSocketStore } from '@/stores/socket/gameSocket.store';

export const useTimer = () => {
  const { actions, timers } = useGameSocketStore();

  const intervalRefs = useRef<Record<TimerType, NodeJS.Timeout | null>>({
    [TimerType.DRAWING]: null,
    [TimerType.GUESSING]: null,
    [TimerType.ENDING]: null,
  });

  useEffect(() => {
    const manageTimer = (timerType: TimerType, value: number | null) => {
      const isTimerActive = value !== null && value > 0;
      const hasInterval = intervalRefs.current[timerType] !== null;

      if (isTimerActive && !hasInterval) {
        intervalRefs.current[timerType] = setInterval(() => actions.decreaseTimer(timerType), 1000);
      } else if (!isTimerActive && hasInterval) {
        clearInterval(intervalRefs.current[timerType]!);
        intervalRefs.current[timerType] = null;
      }
    };

    Object.keys(timers).forEach((key) => {
      if (!(key in TimerType)) return;
      const timerType = key as TimerType;
      manageTimer(timerType, timers[timerType]);
    });

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
  ]);

  return timers;
};
