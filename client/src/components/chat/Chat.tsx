import { FormEvent, useState } from 'react';
import type { ChatResponse } from '@troublepainter/core';
import { ChatBubble } from '@/components/chat/ChatBubbleUI';
import { Input } from '@/components/ui/Input';
import { chatSocketHandlers } from '@/handlers/socket/chatSocket.handler';
import { useChatSocket } from '@/hooks/socket/useChatSocket';
import { useScrollToBottom } from '@/hooks/useScrollToBottom';
import { useChatSocketStore } from '@/stores/socket/chatSocket.store';
import { useGameSocketStore } from '@/stores/socket/gameSocket.store';

export const Chat = () => {
  const [inputMessage, setInputMessage] = useState('');
  const { messages, isConnected, currentPlayerId } = useChatSocket();
  const { players } = useGameSocketStore();
  const { actions } = useChatSocketStore();
  const { containerRef } = useScrollToBottom([messages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isConnected || !inputMessage.trim()) return;
    void chatSocketHandlers.sendMessage(inputMessage);

    const currentPlayer = players?.find((player) => player.playerId === currentPlayerId);
    if (!currentPlayer || !currentPlayerId) throw new Error('Current player not found');
    const messageData: ChatResponse = {
      playerId: currentPlayerId as string,
      nickname: currentPlayer.nickname,
      message: inputMessage.trim(),
      createdAt: new Date().toISOString(),
    };
    actions.addMessage(messageData);

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
              key={`${message.playerId}-${message.createdAt}`}
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
