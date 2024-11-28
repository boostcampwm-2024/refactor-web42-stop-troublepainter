import { useEffect } from 'react';
import {
  PlayerRole,
  type JoinRoomResponse,
  type PlayerLeftResponse,
  type RoundStartResponse,
  type UpdateSettingsResponse,
  type TimerSyncResponse,
  RoundEndResponse,
  RoomStatus,
  TimerType,
} from '@troublepainter/core';
import { useNavigate, useParams } from 'react-router-dom';
import { gameSocketHandlers } from '@/handlers/socket/gameSocket.handler';
import { useGameSocketStore } from '@/stores/socket/gameSocket.store';
import { SocketNamespace } from '@/stores/socket/socket.config';
import { useSocketStore } from '@/stores/socket/socket.store';
import { checkTimerDifference } from '@/utils/checkTimerDifference';
import { playerIdStorageUtils } from '@/utils/playerIdStorage';

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
  const navigate = useNavigate();

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
      gameSocketHandlers.reconnect({ playerId: savedPlayerId, roomId }).catch((error) => {
        // 재연결 실패 시 계정 삭제
        console.error('Reconnection failed:', error);
        playerIdStorageUtils.removePlayerId(roomId);
      });
    }
    // savedPlayerId가 없다면 새로운 접속 시도
    else {
      playerIdStorageUtils.removeAllPlayerIds();
      gameSocketHandlers.joinRoom({ roomId }).catch(console.error);
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
        gameActions.updateRoomSettings({ ...roomSettings, drawTime: roomSettings.drawTime - 5 });
        gameActions.updatePlayers(players);
        if (playerId) {
          playerIdStorageUtils.setPlayerId(roomId, playerId);
          gameActions.updateCurrentPlayerId(playerId);
          gameActions.updateIsHost(room.hostId === playerId);
        }
      },

      playerJoined: (response: JoinRoomResponse) => {
        const { room, roomSettings, players } = response;
        gameActions.updateRoom(room);
        gameActions.updateRoomSettings({ ...roomSettings, drawTime: roomSettings.drawTime - 5 });
        gameActions.updatePlayers(players);
      },

      playerLeft: (response: PlayerLeftResponse) => {
        const { leftPlayerId, players } = response;
        gameActions.removePlayer(leftPlayerId);
        gameActions.updatePlayers(players);
      },

      settingsUpdated: (response: UpdateSettingsResponse) => {
        const { settings } = response;
        gameActions.updateRoomSettings({ ...settings, drawTime: settings.drawTime - 5 });
      },

      drawingGroupRoundStarted: (response: RoundStartResponse) => {
        const { roundNumber, roles, word, assignedRole, drawTime } = response;
        const { painters, devils, guessers } = roles;
        gameActions.updateCurrentRound(roundNumber);
        gameActions.updateRoundAssignedRole(assignedRole);
        painters?.forEach((playerId) => gameActions.updatePlayerRole(playerId, PlayerRole.PAINTER));
        guessers?.forEach((playerId) => gameActions.updatePlayerRole(playerId, PlayerRole.GUESSER));
        devils?.forEach((playerId) => gameActions.updatePlayerRole(playerId, PlayerRole.DEVIL));
        if (word) gameActions.updateCurrentWord(word);
        gameActions.updateTimer(TimerType.DRAWING, drawTime);
        gameActions.updateRoomStatus(RoomStatus.DRAWING);
        navigate(`/game/${roomId}`, { replace: true }); // replace: true로 설정, 히스토리에서 대기방 제거
      },

      guesserRoundStarted: (response: RoundStartResponse) => {
        const { roundNumber, roles, assignedRole, drawTime } = response;
        const { guessers } = roles;
        gameActions.updateCurrentRound(roundNumber);
        gameActions.updateRoundAssignedRole(assignedRole);
        guessers?.forEach((playerId) => gameActions.updatePlayerRole(playerId, PlayerRole.GUESSER));
        gameActions.updateTimer(TimerType.DRAWING, drawTime);
        gameActions.updateRoomStatus(RoomStatus.DRAWING);
        navigate(`/game/${roomId}`, { replace: true });
      },

      timerSync: (response: TimerSyncResponse) => {
        const { remaining, timerType } = response;
        const serverTimer = Math.ceil(remaining / 1000);
        const clientTimer = useGameSocketStore.getState().timers[timerType];
        if (clientTimer === null || checkTimerDifference(serverTimer, clientTimer, 1)) {
          gameActions.updateTimer(timerType, serverTimer);
        }
      },

      drawingTimeEnded: () => {
        gameActions.updateRoomStatus(RoomStatus.GUESSING);
        gameActions.updateTimer(TimerType.GUESSING, 10);
      },

      roundEnded: (response: RoundEndResponse) => {
        const { roundNumber, word, winner, players } = response;
        gameActions.updateCurrentRound(roundNumber);
        gameActions.updateCurrentWord(word);
        gameActions.updateRoundWinner(winner);
        gameActions.updateTimer(TimerType.ENDING, 10);
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
