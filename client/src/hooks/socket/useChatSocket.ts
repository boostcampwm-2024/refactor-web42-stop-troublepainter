import { useCallback, useEffect } from 'react';
import { ChatResponse } from '@troublepainter/core';
import { useParams } from 'react-router-dom';
import { useChatStore } from '@/stores/socket/chatSocket.store';
import { useGameSocketStore } from '@/stores/socket/gameSocket.store';
import { SocketNamespace } from '@/stores/socket/socket.config';
import { useSocketStore } from '@/stores/socket/socket.store';
import { playerIdStorageUtils } from '@/utils/playerIdStorage';

export const useChatSocket = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { sockets, connected, actions: socketActions } = useSocketStore();
  const { players } = useGameSocketStore();
  const { messages, isScrollLocked, actions: chatActions } = useChatStore();
  const currentPlayerId = playerIdStorageUtils.getPlayerId(roomId as string);

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

  // 메시지 전송
  const sendMessage = useCallback(
    (message: string) => {
      const socket = sockets.chat;
      if (!socket || !connected.chat || !message.trim() || !currentPlayerId) return;

      const currentPlayer = players?.find((player) => player.playerId === currentPlayerId);
      if (!currentPlayer) return;

      const messageData: ChatResponse = {
        playerId: currentPlayerId,
        nickname: currentPlayer.nickname,
        message: message.trim(),
        createdAt: new Date(),
      };

      chatActions.addMessage(messageData);
      socket.emit('sendMessage', { message: message.trim() });
    },
    [sockets.chat, connected.chat, chatActions, currentPlayerId, players],
  );

  return {
    messages,
    isScrollLocked,
    isConnected: connected.chat,
    currentPlayerId,
    sendMessage,
    actions: chatActions,
  };
};
