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

/**
 * 채팅 상태와 액션을 관리하는 ㄴtore입니다.
 *
 * @remarks
 * 채팅 메시지 저장소를 관리하고 메시지 관리를 위한 액션을 제공합니다.
 *
 * @example
 * ```typescript
 * const { messages, actions } = useChatStore();
 * actions.addMessage(newMessage);
 * ```
 */

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
