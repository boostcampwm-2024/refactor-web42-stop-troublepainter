import { memo } from 'react';
import { ChatBubble } from '@/components/chat/ChatBubbleUI';
import { useScrollToBottom } from '@/hooks/useScrollToBottom';
import { useChatSocketStore } from '@/stores/socket/chatSocket.store';
import { useGameSocketStore } from '@/stores/socket/gameSocket.store';

export const ChatList = memo(() => {
  const messages = useChatSocketStore((state) => state.messages);
  const currentPlayerId = useGameSocketStore((state) => state.currentPlayerId);
  const { containerRef } = useScrollToBottom([messages]);

  return (
    <div ref={containerRef} className="flex h-full flex-col gap-2 overflow-y-auto">
      <p className="mb-7 text-center text-xl text-eastbay-50">
        여기에다가 답하고
        <br /> 채팅할 수 있습니다.
      </p>

      {messages.map((message) => {
        const isOthers = message.playerId !== currentPlayerId;
        return (
          <ChatBubble
            key={`${message.playerId}-${message.createdAt}`}
            content={message.message}
            nickname={isOthers ? message.nickname : undefined}
            variant={isOthers ? 'default' : 'secondary'}
          />
        );
      })}
    </div>
  );
});
