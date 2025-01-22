import type { CRDTMessage } from '@troublepainter/core';
import { useSocketStore } from '@/stores/socket/socket.store';

const messages: CRDTMessage[] = [];

export const drawingSocketHandlers = {
  // 드로잉 데이터 전송
  sendDrawing: (drawingData: CRDTMessage) => {
    const socket = useSocketStore.getState().sockets.drawing;
    if (!socket) throw new Error('Socket not connected');

    if (messages.length === 0) {
      setTimeout(() => {
        socket.emit('draw', { drawingData: messages });
        messages.length = 0;
      }, 100);
    }

    messages.push(drawingData);
  },
};

export type DrawSocketHandlers = typeof drawingSocketHandlers;
