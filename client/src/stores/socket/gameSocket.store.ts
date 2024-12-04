import { Player, PlayerRole, PlayerStatus, Room, RoomSettings, RoomStatus, TerminationType } from '@troublepainter/core';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface GameState {
  room: Room | null;
  roomSettings: RoomSettings | null;
  players: Player[];
  roundWinners: Player[] | null;
  roundAssignedRole: PlayerRole | null;
  gameTerminateType: TerminationType | null;
  currentPlayerId: string | null;
  isHost: boolean | null;
}

interface GameActions {
  // 상태 업데이트 액션

  // room 상태 업데이트
  updateRoom: (room: Room) => void;
  updateCurrentRound: (currentRound: number) => void;
  updateCurrentWord: (currentWord: string) => void;
  updateRoomStatus: (status: RoomStatus) => void;
  updateHost: (hostId: string) => void;

  // roomSetting 상태 업데이트
  updateRoomSettings: (settings: RoomSettings) => void;

  // player 상태 업데이트
  updatePlayers: (players: Player[]) => void;
  removePlayer: (playerId: string) => void;
  updatePlayerRole: (playerId: string, role: PlayerRole) => void;
  updatePlayersStatus: (status: PlayerStatus) => void;

  // 나의 상태 업데이트
  updateCurrentPlayerId: (currentPlayerId: string) => void;
  updateIsHost: (isHost: boolean) => void;
  updateRoundAssignedRole: (role: PlayerRole) => void;

  // 승자 상태 업데이트
  updateRoundWinners: (players: Player[]) => void;

  // 종료 타입 업데이트
  updateGameTerminateType: (terminateType: TerminationType) => void;

  // 상태 초기화
  resetRound: () => void;
  resetGame: () => void;
  reset: () => void;
}

const initialState: GameState = {
  room: null,
  roomSettings: null,
  players: [],
  currentPlayerId: null,
  isHost: null,
  roundWinners: null,
  roundAssignedRole: null,
  gameTerminateType: null,
};

const resetCommonState = () => ({
  roundWinners: null,
  roundAssignedRole: null,
});

/**
 * 게임 상태를 관리하는 Store입니다.
 *
 * @remarks
 * 게임의 전역 상태(방, 플레이어, 설정 등)를 저장하고
 * 소켓 이벤트에 따라 상태를 업데이트합니다.
 *
 * @example
 * ```typescript
 * const GameComponent = () => {
 *   const { room, players, actions } = useGameSocketStore();
 *
 *   if (!room) return <div>로딩중...</div>;
 *
 *   return (
 *     <div>
 *       <h1>방 {room.roomId}</h1>
 *       <PlayerList players={players} />
 *     </div>
 *   );
 * };
 * ```
 *
 * @category Store
 */
export const useGameSocketStore = create<GameState & { actions: GameActions }>()(
  devtools(
    (set) => ({
      ...initialState,

      actions: {
        // 상태 업데이트 액션
        updateRoom: (room) => {
          set({ room });
        },

        updateCurrentRound: (currentRound) => {
          set((state) => ({
            room: state.room && { ...state.room, currentRound },
          }));
        },

        updateCurrentWord: (currentWord) => {
          set((state) => ({
            room: state.room && { ...state.room, currentWord },
          }));
        },

        updateHost: (hostId) => {
          set((state) => ({
            room: state.room && { ...state.room, hostId },
          }));
        },

        updateRoomStatus: (status) => {
          set((state) => ({ room: state.room && { ...state.room, status } }));
        },

        updateRoomSettings: (settings) => {
          set({ roomSettings: settings });
        },

        updatePlayers: (players) => {
          set({ players });
        },

        updatePlayersStatus: (status) => {
          set((state) => ({ players: state.players.map((player) => ({ ...player, status })) }));
        },

        updateCurrentPlayerId: (currentPlayerId) => {
          set({ currentPlayerId });
        },

        removePlayer: (playerId) => {
          set((state) => ({
            players: state.players.filter((player) => player.playerId !== playerId),
          }));
        },

        updatePlayerRole: (playerId, role) => {
          set((state) => ({
            players: state.players.map((player) => (player.playerId === playerId ? { ...player, role } : player)),
          }));
        },

        updateIsHost: (isHost) => {
          set({ isHost });
        },

        updateRoundAssignedRole: (playerRole) => {
          set({ roundAssignedRole: playerRole });
        },

        updateGameTerminateType: (type) => {
          set({ gameTerminateType: type });
        },

        updateRoundWinners: (players) => {
          set({ roundWinners: players });
        },

        // 상태 초기화
        reset: () => {
          set(initialState);
        },

        // 라운드 상태 초기화
        resetRound: () => {
          set((state) => ({
            ...state,
            ...resetCommonState(),
            room: state.room && { ...state.room, currentWord: '' },
            players: state.players.map((player) => ({ ...player, role: undefined })),
          }));
        },

        // 게임 상태 초기화
        resetGame: () => {
          set((state) => ({
            ...state,
            ...resetCommonState(),
            room: state.room && { ...state.room, currentWord: '', status: RoomStatus.WAITING, currentRound: 0 },
            players: state.players.map((player) => ({
              ...player,
              role: undefined,
              score: 0,
              status: PlayerStatus.NOT_PLAYING,
            })),
          }));
        },
      },
    }),
    { name: 'GameSocketStore' },
  ),
);
