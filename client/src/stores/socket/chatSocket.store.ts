import { ChatResponse } from '@troublepainter/core';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface ChatState {
  messages: ChatResponse[];
}

const initialState: ChatState = {
  messages: [],
};

export interface ChatStore {
  actions: {
    addMessage: (message: ChatResponse) => void;
    clearMessages: () => void;
  };
}

/**
 * 채팅 상태와 액션을 관리하는 ㄴtore입니다.
 *
 * @remarks
 * 채팅 메시지 저장소를 관리하고 메시지 관리를 위한 액션을 제공합니다.
 *
 * @example
 * ```typescript
 * const { messages, actions } = useChatSocketStore();
 * actions.addMessage(newMessage);
 * ```
 */
export const useChatSocketStore = create<ChatState & ChatStore>()(
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
