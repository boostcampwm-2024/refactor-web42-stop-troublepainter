import { TimerType } from '@troublepainter/core';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface TimerState {
  timers: Record<TimerType, number | null>;
}

interface TimerActions {
  actions: {
    updateTimer: (timerType: TimerType, time: number) => void;
    decreaseTimer: (timerType: TimerType) => void;
    resetTimers: () => void;
  };
}

const initialState: TimerState = {
  timers: {
    [TimerType.DRAWING]: null,
    [TimerType.GUESSING]: null,
    [TimerType.ENDING]: null,
  },
};

export const useTimerStore = create<TimerState & TimerActions>()(
  devtools(
    (set) => ({
      ...initialState,
      actions: {
        updateTimer: (timerType, time) => {
          set(
            (state) => ({
              timers: {
                ...state.timers,
                [timerType]: time,
              },
            }),
            false,
            'timers/update',
          );
        },

        decreaseTimer: (timerType) => {
          set(
            (state) => ({
              timers: {
                ...state.timers,
                [timerType]: Math.max(0, (state.timers[timerType] ?? 0) - 1),
              },
            }),
            false,
            'timers/decrease',
          );
        },

        resetTimers: () => {
          set({ timers: initialState.timers }, false, 'timers/reset');
        },
      },
    }),
    { name: 'TimerStore' },
  ),
);
