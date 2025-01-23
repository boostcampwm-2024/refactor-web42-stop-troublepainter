import { useEffect } from 'react';
import { ChatResponse } from '@troublepainter/core';
import { useParams } from 'react-router-dom';
import { useChatSocketStore } from '@/stores/socket/chatSocket.store';
import { useGameSocketStore } from '@/stores/socket/gameSocket.store';
// import { SocketNamespace } from '@/stores/socket/socket.config';
// import { useSocketStore } from '@/stores/socket/socket.store';
import { addMessageHandler, connectChat, disconnectChat, removeMessageHandler } from '@/stores/socket/chatWorker.ts';

/**
 * 채팅 소켓 연결과 메시지 처리를 관리하는 커스텀 훅입니다.
 *
 * @remarks
 * - 소켓 연결 생명주기 관리
 * - 메시지 송수신 처리
 * - 메시지 영속성을 위한 채팅 스토어 통합
 *
 * @returns
 * - `messages` - 채팅 메시지 배열
 * - `isConnected` - 소켓 연결 상태
 * - `currentPlayerId` - 현재 사용자 ID
 * - `sendMessage` - 새 메시지 전송 함수
 *
 * @example
 * ```typescript
 * useChatSocket();
 *
 * // 메시지 전송
 * sendMessage("안녕하세요");
 * ```
 */
let isConnected = false;

export const useChatSocket = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const currentPlayerId = useGameSocketStore((state) => state.currentPlayerId);
  const chatActions = useChatSocketStore((state) => state.actions);

  // const currentRoomRef = useRef<string | null>(null);

  useEffect(() => {
    // console.log('Ref: ', currentRoomRef.current, 'player id: ', currentPlayerId, 'roomiD: ', roomId);
    if (!roomId || !currentPlayerId) return;

    // 아직 연결되지 않은 경우에만 연결 시도
    if (!isConnected) {
      isConnected = true;
      // currentRoomRef.current = roomId;
      connectChat({
        roomId,
        playerId: currentPlayerId,
      });
    }

    return () => {
      disconnectChat();
      chatActions.clearMessages();
      isConnected = false;
    };
  }, [roomId, currentPlayerId, chatActions]);

  useEffect(() => {
    if (!currentPlayerId) return;

    const messageHandler = (e: MessageEvent) => {
      const { type, event, args } = e.data;

      if (type === 'socket_event' && event === 'messageReceived' && args?.[0]) {
        const messageData = args[0] as ChatResponse;
        chatActions.addMessage(messageData);
      }
    };

    addMessageHandler(messageHandler);

    return () => {
      removeMessageHandler(messageHandler);
    };
  }, [currentPlayerId, chatActions]);
};
