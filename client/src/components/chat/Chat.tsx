import { FormEvent, useState } from 'react';
import { ChatBubble } from '@/components/chat/ChatBubbleUI';
import { Input } from '@/components/ui/Input';
import { useChatSocket } from '@/hooks/socket/useChatSocket';
import { useScrollToBottom } from '@/hooks/useScrollToBottom';

export const Chat = () => {
  const [inputMessage, setInputMessage] = useState('');
  const { messages, isConnected, currentPlayerId, sendMessage } = useChatSocket();
  const { containerRef } = useScrollToBottom([messages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isConnected || !inputMessage.trim()) return;

    sendMessage(inputMessage);
    setInputMessage('');
  };

  return (
    <div className="relative flex h-full w-full flex-col">
      <div ref={containerRef} className="flex h-full flex-col gap-2 overflow-y-auto">
        <p className="mb-7 text-center text-xl text-eastbay-50">
          여기에다가 답하고
          <br /> 채팅할 수 있습니다.
        </p>

        {messages.map((message) => {
          const isOthers = message.playerId !== currentPlayerId;
          return (
            <ChatBubble
              key={`${message.playerId}-${message.createdAt.getTime()}`}
              content={message.message}
              nickname={isOthers ? message.nickname : undefined}
              variant={isOthers ? 'default' : 'secondary'}
            />
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="mt-1 w-full">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="메시지를 입력하세요"
          maxLength={100}
          disabled={!isConnected}
          autoComplete="off"
        />
      </form>
    </div>
  );
};
