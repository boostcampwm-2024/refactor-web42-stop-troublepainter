import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

interface TimerCallbacks {
  onTick: (remaining: number) => void;
  onTimeUp: () => void;
}

@Injectable()
export class TimerService {
  private timers = new Map<string, { intervalId: NodeJS.Timeout; endTime: number; duration: number }>();

  constructor() {}

  startTimer(server: Server, roomId: string, duration: number, callbacks: TimerCallbacks) {
    this.stopGameTimer(roomId);

    const startTime = Date.now();
    const endTime = startTime + duration;

    const intervalId = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);

      callbacks.onTick(remaining);

      if (remaining === 0) {
        this.stopGameTimer(roomId);
        callbacks.onTimeUp();
      }
    }, 5000);

    this.timers.set(roomId, {
      intervalId,
      endTime,
      duration,
    });
  }

  stopGameTimer(roomId: string) {
    const timer = this.timers.get(roomId);

    if (timer) {
      clearInterval(timer.intervalId);
      this.timers.delete(roomId);
    }
  }

  getRemainingTime(roomId: string) {
    const timer = this.timers.get(roomId);
    if (!timer) return 0;

    return Math.max(0, timer.endTime - Date.now());
  }

  clearAllTimers() {
    this.timers.forEach((timer) => {
      clearInterval(timer.intervalId);
    });
    this.timers.clear();
  }
}
