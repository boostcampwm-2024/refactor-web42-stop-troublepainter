import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PlayerRole, RoomStatus, type ChatResponse } from '@troublepainter/core';
import { ChatBubble } from '@/components/chat/ChatBubbleUI';
import { Input } from '@/components/ui/Input';
import { SHORTCUT_KEY } from '@/constants/shortcutKey';
import { chatSocketHandlers } from '@/handlers/socket/chatSocket.handler';
import { gameSocketHandlers } from '@/handlers/socket/gameSocket.handler';
import { useChatSocket } from '@/hooks/socket/useChatSocket';
import { useScrollToBottom } from '@/hooks/useScrollToBottom';
import { useChatSocketStore } from '@/stores/socket/chatSocket.store';
import { useGameSocketStore } from '@/stores/socket/gameSocket.store';

export const Chat = () => {
  const [inputMessage, setInputMessage] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { messages, isConnected, currentPlayerId } = useChatSocket();
  const { players, room, roundAssignedRole } = useGameSocketStore();
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

    if (room?.status === RoomStatus.GUESSING) {
      void gameSocketHandlers.checkAnswer({ answer: inputMessage });
    }

    setInputMessage('');
  };

  const shouldDisableInput = useMemo(() => {
    const ispainters = roundAssignedRole !== PlayerRole.GUESSER;
    const isDrawing = room?.status === 'DRAWING' || room?.status === 'GUESSING';
    return ispainters && isDrawing;
  }, [roundAssignedRole, room?.status]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key !== SHORTCUT_KEY.CHAT || !inputRef.current) return;

      // 현재 포커스된 요소가 없거나, 포커스된 요소가 body라면 input을 포커싱
      const isNoFocusedElement = !document.activeElement || document.activeElement === document.body;

      if (isNoFocusedElement) {
        inputRef.current?.focus();
      } else if (inputMessage.trim() === '') {
        inputRef.current.blur();
      } else {
        inputRef.current?.focus();
      }
    },
    [inputMessage],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

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
          ref={inputRef}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="메시지를 입력하세요"
          maxLength={100}
          disabled={!isConnected || shouldDisableInput}
          autoComplete="off"
        />
      </form>
    </div>
  );
};
