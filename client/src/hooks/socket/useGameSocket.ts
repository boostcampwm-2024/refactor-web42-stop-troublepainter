import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { JoinRoomResponse, PlayerLeftResponse } from '@/types/socketShared.types';
import { playerIdStorageUtils, useGameSocketStore } from '@/stores/socket/gameSocket.store';
import { SocketNamespace } from '@/stores/socket/socket.config';
import { useSocketStore } from '@/stores/socket/socket.store';

/**
 * 게임 진행에 필요한 소켓 연결과 상태를 관리하는 Hook입니다.
 *
 * @remarks
 * - store 중심적 구조
 * - 자동 연결/재연결 처리
 * - 플레이어 식별자 영속성 관리
 * - 게임의 전반적인 상태 관리 (room, players, settings 등)
 * - 여러 게임 상태 이벤트 포괄적인 핸들링
 *
 * @example
 * ```typescript
 * // GameLayout.tsx에서의 사용 예시
 * const GameLayout = () => {
 *   const { isConnected } = useGameSocket();
 *
 *   // 연결 상태에 따른 UI 처리
 *   if (!isConnected) {
 *     return <LoadingSpinner message="연결 중..." />;
 *   }
 *
 *   return (
 *     <div>
 *       <header />
 *       <Outlet />
 *     </div>
 *   );
 * };
 *
 * // GameRoom.tsx에서의 이벤트 처리 예시
 * const GameRoom = () => {
 *   const { socket, actions } = useGameSocket();
 *
 *   useEffect(() => {
 *     // 게임 시작 처리
 *     if (canStartGame) {
 *       actions.startGame();
 *     }
 *   }, [canStartGame]);
 *
 *   return <GameUI />;
 * };
 * ```
 *
 * @returns 게임 소켓 상태와 액션 메소드들
 * - `socket` - 현재 게임 소켓 인스턴스
 * - `isConnected` - 연결 상태
 * - `actions` - 게임 상태 관리 메소드들
 *
 * @throws 소켓 연결 실패 시 에러
 * @category Hooks
 */
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
