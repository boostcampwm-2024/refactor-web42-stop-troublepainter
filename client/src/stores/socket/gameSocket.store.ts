import { Player, Room, RoomSettings } from '@troublepainter/core';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface GameState {
  room: Room | null;
  roomSettings: RoomSettings | null;
  players: Player[];
  currentPlayerId: string | null;
}

interface GameActions {
  // 상태 업데이트 액션
  updateRoom: (room: Room) => void;
  updateRoomSettings: (settings: RoomSettings) => void;
  updatePlayers: (players: Player[]) => void;
  updateCurrentPlayerId: (currentPlayerId: string) => void;
  removePlayer: (playerId: string) => void;

  // 상태 초기화
  reset: () => void;
}

const initialState: GameState = {
  room: null,
  roomSettings: null,
  players: [],
  currentPlayerId: null,
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

        // 상태 초기화
        reset: () => {
          set(initialState);
        },
      },
    }),
    { name: 'GameSocketStore' },
  ),
);
