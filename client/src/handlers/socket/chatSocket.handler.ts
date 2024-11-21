import { useSocketStore } from '@/stores/socket/socket.store';

export const chatSocketHandlers = {
  sendMessage: (message: string): Promise<void> => {
    const socket = useSocketStore.getState().sockets.chat;
    if (!socket) throw new Error('Chat Socket not connected');

    return new Promise((resolve) => {
      socket.emit('sendMessage', { message: message.trim() });
      resolve();
    });
  },
};

export type ChatSocketHandlers = typeof chatSocketHandlers;
