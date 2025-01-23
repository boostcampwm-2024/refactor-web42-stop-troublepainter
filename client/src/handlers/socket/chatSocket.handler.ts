// import { useSocketStore } from '@/stores/socket/socket.store';
import { sendChatMessage } from '@/stores/socket/chatWorker.ts';

export const chatSocketHandlers = {
  sendMessage: (messages: string): void => sendChatMessage(messages),
};

export type ChatSocketHandlers = typeof chatSocketHandlers;
