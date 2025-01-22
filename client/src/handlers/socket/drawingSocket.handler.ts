import type { CRDTMessage } from '@troublepainter/core';
import { useSocketStore } from '@/stores/socket/socket.store';

export const drawingSocketHandlers = {
  // 드로잉 데이터 전송
  sendDrawing: (drawingData: CRDTMessage) => {
    const socket = useSocketStore.getState().sockets.drawing;
    if (!socket) throw new Error('Socket not connected');

    socket.emit('draw', { drawingData });
  },
};

export type DrawSocketHandlers = typeof drawingSocketHandlers;
