import type { DrawingData } from '@troublepainter/core';
import { useSocketStore } from '@/stores/socket/socket.store';

export const drawingSocketHandlers = {
  // 드로잉 데이터 전송
  sendDrawing: (drawingData: DrawingData): Promise<void> => {
    const socket = useSocketStore.getState().sockets.drawing;
    if (!socket) throw new Error('Socket not connected');

    return new Promise((resolve) => {
      socket.emit('draw', { drawingData });
      resolve();
    });
  },
};

export type DrawSocketHandlers = typeof drawingSocketHandlers;
