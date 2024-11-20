import { ChatResponse } from '@troublepainter/core';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface ChatState {
  messages: ChatResponse[];
}

export interface ChatStore extends ChatState {
  actions: {
    addMessage: (message: ChatResponse) => void;
    clearMessages: () => void;
  };
}

const initialState: ChatState = {
  messages: [],
};

export const useChatStore = create<ChatStore>()(
  devtools(
    (set) => ({
      ...initialState,
      actions: {
        addMessage: (message) =>
          set((state) => ({
            messages: [...state.messages, message],
          })),

        clearMessages: () => set({ messages: [] }),
      },
    }),
    { name: 'ChatStore' },
  ),
);
