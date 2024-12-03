import { FormEvent, memo, useMemo, useRef, useState } from 'react';
import { PlayerRole, RoomStatus, type ChatResponse } from '@troublepainter/core';
import { Input } from '@/components/ui/Input';
import { chatSocketHandlers } from '@/handlers/socket/chatSocket.handler';
import { gameSocketHandlers } from '@/handlers/socket/gameSocket.handler';
import { useShortcuts } from '@/hooks/useShortcuts';
import { useChatSocketStore } from '@/stores/socket/chatSocket.store';
import { useGameSocketStore } from '@/stores/socket/gameSocket.store';
import { useSocketStore } from '@/stores/socket/socket.store';

export const ChatInput = memo(() => {
  const [inputMessage, setInputMessage] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  // 개별 Selector
  const isConnected = useSocketStore((state) => state.connected.chat);
  const currentPlayerId = useGameSocketStore((state) => state.currentPlayerId);
  const players = useGameSocketStore((state) => state.players);
  const roomStatus = useGameSocketStore((state) => state.room?.status);
  const roundAssignedRole = useGameSocketStore((state) => state.roundAssignedRole);
  // 챗 액션
  const chatActions = useChatSocketStore((state) => state.actions);

  const shouldDisableInput = useMemo(() => {
    const ispainters = roundAssignedRole !== PlayerRole.GUESSER;
    const isDrawing = roomStatus === 'DRAWING' || roomStatus === 'GUESSING';
    return ispainters && isDrawing;
  }, [roundAssignedRole, roomStatus]);

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
    chatActions.addMessage(messageData);

    if (roomStatus === RoomStatus.GUESSING) {
      void gameSocketHandlers.checkAnswer({ answer: inputMessage });
    }

    setInputMessage('');
  };

  useShortcuts([
    {
      key: 'CHAT',
      action: () => {
        // 현재 포커스된 요소가 없거나, 포커스된 요소가 body라면 input을 포커싱
        const isNoFocusedElement = !document.activeElement || document.activeElement === document.body;

        if (isNoFocusedElement) {
          inputRef.current?.focus();
        } else if (inputMessage.trim() === '') {
          inputRef.current?.blur();
        }
      },
      disabled: !inputRef.current, // input ref가 없을 때는 비활성화
    },
  ]);

  return (
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
  );
});
