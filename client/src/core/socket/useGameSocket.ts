import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { playerIdStorageUtils, useGameSocketStore } from './gameSocket.store';
import { SocketNamespace } from './socket.config';
import { useSocketStore } from './socket.store';
import type { JoinRoomResponse, PlayerLeftResponse } from './socket.types';

export const useGameSocket = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { sockets, connected, actions: socketActions } = useSocketStore();
  const { actions: gameActions } = useGameSocketStore();

  // 연결 + 재연결 시도
  useEffect(() => {
    // roomId가 없으면 연결하지 않음
    if (!roomId) return;

    // 소켓 연결
    socketActions.connect(SocketNamespace.GAME);

    // 현재 방의 연결 정보 처리
    const savedPlayerId = playerIdStorageUtils.getPlayerId(roomId);
    // console.log(savedPlayerId, roomId);
    if (savedPlayerId) {
      gameActions.reconnect({ playerId: savedPlayerId, roomId }).catch((error) => {
        // 재연결 실패 시 계정 삭제
        console.error('Reconnection failed:', error);
        playerIdStorageUtils.removePlayerId(roomId);
      });
    }
    // savedPlayerId가 없다면 새로운 접속 시도
    else {
      playerIdStorageUtils.removeAllPlayerIds();
      gameActions.joinRoom({ roomId }).catch(console.error);
    }

    // 연결 해제 시 현재 방의 playerId만 제거
    return () => {
      socketActions.disconnect(SocketNamespace.GAME);
      playerIdStorageUtils.removePlayerId(roomId);
    };
  }, [roomId]);

  useEffect(() => {
    const socket = sockets.game;
    if (!socket || !roomId) return;

    const handlers = {
      joinedRoom: (response: JoinRoomResponse) => {
        const { room, roomSettings, players, playerId } = response;
        gameActions.updateRoom(room);
        gameActions.updateRoomSettings(roomSettings);
        gameActions.updatePlayers(players);
        if (playerId) playerIdStorageUtils.setPlayerId(roomId, playerId);
      },

      playerJoined: (response: JoinRoomResponse) => {
        const { room, roomSettings, players } = response;
        gameActions.updateRoom(room);
        gameActions.updateRoomSettings(roomSettings);
        gameActions.updatePlayers(players);
      },

      playerLeft: (response: PlayerLeftResponse) => {
        const { leftPlayerId, players } = response;
        gameActions.removePlayer(leftPlayerId);
        gameActions.updatePlayers(players);
      },
    };

    // 이벤트 리스너 등록
    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      // 이벤트 리스너 제거
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [sockets.game, roomId]);

  return {
    socket: sockets.game,
    isConnected: connected.game,
    actions: gameActions,
  };
};
