import { useEffect } from 'react';
import { ChatResponse } from '@troublepainter/core';
import { useParams } from 'react-router-dom';
import { useChatSocketStore } from '@/stores/socket/chatSocket.store';
import { useGameSocketStore } from '@/stores/socket/gameSocket.store';
import { SocketNamespace } from '@/stores/socket/socket.config';
import { useSocketStore } from '@/stores/socket/socket.store';

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
export const useChatSocket = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const sockets = useSocketStore((state) => state.sockets);
  const socketActions = useSocketStore((state) => state.actions);
  const currentPlayerId = useGameSocketStore((state) => state.currentPlayerId);
  const chatActions = useChatSocketStore((state) => state.actions);

  // Socket 연결 설정
  useEffect(() => {
    if (!roomId || !currentPlayerId) return;

    socketActions.connect(SocketNamespace.CHAT, {
      roomId,
      playerId: currentPlayerId,
    });

    return () => {
      socketActions.disconnect(SocketNamespace.CHAT);
      chatActions.clearMessages();
    };
  }, [roomId, currentPlayerId, socketActions]);

  // 메시지 수신 이벤트 리스너
  useEffect(() => {
    const socket = sockets.chat;
    if (!socket || !currentPlayerId) return;

    const handleMessageReceived = (response: ChatResponse) => {
      chatActions.addMessage(response);
    };

    socket.on('messageReceived', handleMessageReceived);

    return () => {
      socket.off('messageReceived', handleMessageReceived);
    };
  }, [sockets.chat, currentPlayerId, chatActions]);
};
