import { Player, PlayerRole, Room, RoomSettings } from '@troublepainter/core';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface GameState {
  room: Room | null;
  roomSettings: RoomSettings | null;
  players: Player[];
  currentPlayerId: string | null;
  timer: number | null;
}

interface GameActions {
  // 상태 업데이트 액션

  // room 상태 업데이트
  updateRoom: (room: Room) => void;
  updateCurrentRound: (currentRound: number) => void;
  updateCurrentWord: (currentWord: string) => void;

  // roomSetting 상태 업데이트
  updateRoomSettings: (settings: RoomSettings) => void;

  // player 상태 업데이트
  updatePlayers: (players: Player[]) => void;
  removePlayer: (playerId: string) => void;
  updatePlayerRole: (playerId: string, role: PlayerRole) => void;

  updateCurrentPlayerId: (currentPlayerId: string) => void;

  // timer 상태 업데이트
  updateTimer: (remaining: number) => void;
  decreaseTimer: () => void;

  // 상태 초기화
  reset: () => void;
}

const initialState: GameState = {
  room: null,
  roomSettings: null,
  players: [],
  currentPlayerId: null,
  timer: null,
};

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

        updateRoomSettings: (settings) => {
          set({ roomSettings: settings });
        },

        updatePlayers: (players) => {
          set({ players });
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

        updateTimer: (remaining) => {
          set({ timer: remaining });
        },

        decreaseTimer: () => {
          set((state) => ({
            timer: state.timer && state.timer - 1,
          }));
        },

        // 상태 초기화
        reset: () => {
          set(initialState);
        },
      },
    }),
    { name: 'GameSocketStore' },
  ),
);
