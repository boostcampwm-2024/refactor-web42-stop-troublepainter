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
  PlayerStatus,
  RoomEndResponse,
  TerminationType,
} from '@troublepainter/core';
import { useNavigate, useParams } from 'react-router-dom';
import entrySound from '@/assets/sounds/entry-sound-effect.mp3';
import { gameSocketHandlers } from '@/handlers/socket/gameSocket.handler';
import { useGameSocketStore } from '@/stores/socket/gameSocket.store';
// import { SocketNamespace } from '@/stores/socket/socket.config';
// import { useSocketStore } from '@/stores/socket/socket.store';
import { useTimerStore } from '@/stores/timer.store';
import { checkTimerDifference } from '@/utils/checkTimerDifference';
import { playerIdStorageUtils } from '@/utils/playerIdStorage';
import { SOUND_IDS, SoundManager } from '@/utils/soundManager';
import { gameSocketConnect, gameSocketDisconnect, offGameEvent, onGameEvent } from '@/stores/socket/gameWorker.ts';
import { useToastStore } from '@/stores/toast.store';

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
 *  // 게임 소켓 연결
 *  useGameSocket();
 *  // 소켓 연결 확인 상태
 *  const isConnected = useSocketStore((state) => state.connected.game);
 *
 *  // 연결 상태에 따른 로딩 표시
 *  if (!isConnected) {
 *    return (
 *      <div className="flex h-screen w-full items-center justify-center">
 *        <DotLottieReact src={loading} loop autoplay className="h-96 w-96" />
 *      </div>
 *    );
 *  }
 *
 *
 *   return (
 *     <div>
 *       <header />
 *       <Outlet />
 *     </div>
 *   );
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
  // const { sockets, actions: socketActions } = useSocketStore();
  const gameActions = useGameSocketStore((state) => state.actions);
  const timerActions = useTimerStore((state) => state.actions);
  const navigate = useNavigate();

  // 컴포넌트 마운트 시 사운드 미리 로드
  useEffect(() => {
    gameSocketConnect();
    const soundManager = SoundManager.getInstance();
    soundManager.preloadSound(SOUND_IDS.ENTRY, entrySound);
  }, []);

  // 연결 + 재연결 시도
  useEffect(() => {
    if (!roomId) return;
    // connected : boolean
    // console.log(gameSocketIsConnected(), playerIdStorageUtils.getPlayerId(roomId));
    // if (gameSocketIsConnected() && !playerIdStorageUtils.getPlayerId(roomId)) {
    // 현재 방의 연결 정보 처리
    const savedPlayerId = playerIdStorageUtils.getPlayerId(roomId);
    if (savedPlayerId) {
      gameSocketHandlers.reconnect({ playerId: savedPlayerId, roomId });
    } else {
      playerIdStorageUtils.removeAllPlayerIds();
      gameSocketHandlers.joinRoom({ roomId });
    }

    // 연결 해제 시 현재 방의 playerId만 제거
    return () => {
      gameSocketDisconnect();
      playerIdStorageUtils.removePlayerId(roomId);
    };
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;

    const soundManager = SoundManager.getInstance();

    const handlers = {
      joinedRoom: (response: JoinRoomResponse) => {
        const { room, roomSettings, players, playerId } = response;
        console.log('joinRoom Res: ', response);
        gameActions.updateRoom(room);
        gameActions.updateRoomSettings({ ...roomSettings, drawTime: roomSettings.drawTime - 5 });
        gameActions.updatePlayers(players);
        if (playerId) {
          playerIdStorageUtils.setPlayerId(roomId, playerId);
          gameActions.updateCurrentPlayerId(playerId);
          gameActions.updateIsHost(room.hostId === playerId);
          void soundManager.playSound(SOUND_IDS.ENTRY, 0.5);
        }
      },

      playerJoined: (response: JoinRoomResponse) => {
        const { room, roomSettings, players } = response;
        gameActions.updateRoom(room);
        gameActions.updateRoomSettings({ ...roomSettings, drawTime: roomSettings.drawTime - 5 });
        gameActions.updatePlayers(players);
        void soundManager.playSound(SOUND_IDS.ENTRY, 0.5);
      },

      playerLeft: (response: PlayerLeftResponse) => {
        const { leftPlayerId, players, hostId } = response;
        gameActions.removePlayer(leftPlayerId);
        gameActions.updatePlayers(players);
        gameActions.updateHost(hostId);
        gameActions.updateIsHost(hostId === useGameSocketStore.getState().currentPlayerId);
      },

      settingsUpdated: (response: UpdateSettingsResponse) => {
        const { settings } = response;
        gameActions.updateRoomSettings({ ...settings, drawTime: settings.drawTime - 5 });
      },

      drawingGroupRoundStarted: (response: RoundStartResponse) => {
        gameActions.resetRound();
        const { roundNumber, roles, word, assignedRole, drawTime } = response;
        const { painters, devils, guessers } = roles;
        gameActions.updatePlayersStatus(PlayerStatus.PLAYING);
        gameActions.updateCurrentRound(roundNumber);
        gameActions.updateRoundAssignedRole(assignedRole);
        painters?.forEach((playerId) => gameActions.updatePlayerRole(playerId, PlayerRole.PAINTER));
        guessers?.forEach((playerId) => gameActions.updatePlayerRole(playerId, PlayerRole.GUESSER));
        devils?.forEach((playerId) => gameActions.updatePlayerRole(playerId, PlayerRole.DEVIL));
        if (word) gameActions.updateCurrentWord(word);
        timerActions.updateTimer(TimerType.DRAWING, drawTime);
        gameActions.updateRoomStatus(RoomStatus.DRAWING);
        navigate(`/game/${roomId}`, { replace: true }); // replace: true로 설정, 히스토리에서 대기방 제거
      },

      guesserRoundStarted: (response: RoundStartResponse) => {
        gameActions.resetRound();
        const { roundNumber, roles, assignedRole, drawTime } = response;
        const { guessers } = roles;
        gameActions.updatePlayersStatus(PlayerStatus.PLAYING);
        gameActions.updateCurrentRound(roundNumber);
        gameActions.updateRoundAssignedRole(assignedRole);
        guessers?.forEach((playerId) => gameActions.updatePlayerRole(playerId, PlayerRole.GUESSER));
        timerActions.updateTimer(TimerType.DRAWING, drawTime);
        gameActions.updateRoomStatus(RoomStatus.DRAWING);
        navigate(`/game/${roomId}`, { replace: true });
      },

      timerSync: (response: TimerSyncResponse) => {
        const { remaining, timerType } = response;
        const serverTimer = Math.ceil(remaining / 1000);
        const clientTimer = useTimerStore.getState().timers[timerType];
        if (clientTimer === null || checkTimerDifference(serverTimer, clientTimer, 1)) {
          timerActions.updateTimer(timerType, serverTimer);
        }
      },

      drawingTimeEnded: () => {
        gameActions.updateRoomStatus(RoomStatus.OCR);
        timerActions.updateTimer(TimerType.OCR, 10);
      },

      ocrTimeEnded: () => {
        gameActions.updateRoomStatus(RoomStatus.GUESSING);
        timerActions.updateTimer(TimerType.GUESSING, 15);
      },

      roundEnded: (response: RoundEndResponse) => {
        const { roundNumber, word, winners, players } = response;
        gameActions.updateCurrentRound(roundNumber);
        gameActions.updateCurrentWord(word);
        gameActions.updateRoundWinners(winners);
        timerActions.updateTimer(TimerType.ENDING, 10);
        gameActions.updatePlayers(players);
      },

      gameEnded: (response: RoomEndResponse) => {
        const { terminationType, leftPlayerId, hostId } = response;
        if (terminationType === TerminationType.PLAYER_DISCONNECT && leftPlayerId && hostId) {
          gameActions.removePlayer(leftPlayerId);
          gameActions.updateHost(hostId);
          gameActions.updateIsHost(hostId === useGameSocketStore.getState().currentPlayerId);
        }
        gameActions.updateRoomStatus(RoomStatus.WAITING);
        gameActions.resetRound();
        gameActions.updateGameTerminateType(terminationType);
        navigate(`/game/${roomId}/result`, { replace: true });
      },

      penaltyMessage: async (response: { playerId: string; word: string }[]) => {
        for (const { playerId, word } of response) {
          const playerName = useGameSocketStore.getState().players.find((e) => e.playerId === playerId)?.nickname;
          if (!playerName) continue;
          useToastStore.getState().actions.addToast({
            title: '앗! 패널티 💥',
            description: `${playerName}님, 연관 단어("${word}") 작성으로 패널티 당첨! 다음엔 조심하세요! 😆`,
          });
          await new Promise((res) => setTimeout(res, 50));
        }
      },
    };

    // 이벤트 리스너 등록
    Object.entries(handlers).forEach(([event, handler]) => {
      onGameEvent(event as any, handler);
    });

    return () => {
      // 이벤트 리스너 제거
      Object.entries(handlers).forEach(([event, handler]) => {
        offGameEvent(event as any, handler);
      });
    };
  }, [roomId]);
};
