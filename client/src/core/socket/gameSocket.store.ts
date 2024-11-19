import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useSocketStore } from './socket.store';
import type { JoinRoomRequest, JoinRoomResponse, ReconnectRequest } from '@/core/socket/socket.types';
import { Player, Room, RoomSettings } from '@/types/game.types';

export const STORAGE_KEYS = {
  PLAYER_ID: (roomId: string) => `playerId_${roomId}`,
} as const;
// PlayerId 관련 로컬스토리지 관리 유틸 함수 추가
export const playerIdStorageUtils = {
  getPlayerId: (roomId: string) => localStorage.getItem(STORAGE_KEYS.PLAYER_ID(roomId)),
  setPlayerId: (roomId: string, playerId: string) => localStorage.setItem(STORAGE_KEYS.PLAYER_ID(roomId), playerId),
  removePlayerId: (roomId: string) => localStorage.removeItem(STORAGE_KEYS.PLAYER_ID(roomId)),
  removeAllPlayerIds: () => {
    Object.keys(localStorage)
      .filter((key) => key.startsWith('playerId_'))
      .forEach((key) => localStorage.removeItem(key));
  },
};

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
  removePlayer: (playerId: string) => void;

  // 소켓 요청 액션
  joinRoom: (request: JoinRoomRequest) => Promise<JoinRoomResponse>;
  reconnect: (request: ReconnectRequest) => Promise<void>;
  // updatePlayerStatus: (request: ReadyRequest) => Promise<void>;
  // updateSettings: (request: UpdateSettingsRequest) => Promise<void>;
  // leaveRoom: () => Promise<void>;

  // 상태 초기화
  reset: () => void;
}

const initialState: GameState = {
  room: null,
  roomSettings: null,
  players: [],
  currentPlayerId: null,
};

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

        removePlayer: (playerId) => {
          set((state) => ({
            players: state.players.filter((player) => player.playerId !== playerId),
          }));
        },

        // 소켓 요청 액션들
        joinRoom: async (request) => {
          const socket = useSocketStore.getState().sockets.game;
          if (!socket) throw new Error('Socket not connected');

          return new Promise((resolve) => {
            socket.emit('joinRoom', request, (response: JoinRoomResponse) => {
              const { room, roomSettings, players, playerId } = response;

              set({
                room,
                roomSettings,
                players,
                currentPlayerId: playerId || null,
              });

              if (playerId) {
                playerIdStorageUtils.setPlayerId(request.roomId, playerId);
              }

              resolve(response);
            });
          });
        },

        reconnect: async (request) => {
          const socket = useSocketStore.getState().sockets.game;
          if (!socket) throw new Error('Socket not connected');

          return new Promise((resolve) => {
            socket.emit('reconnect', request);

            // 재연결 성공 이벤트 대기
            const handleReconnected = (response: JoinRoomResponse) => {
              const { room, roomSettings, players } = response;

              set({
                room,
                roomSettings,
                players,
                currentPlayerId: request.playerId,
              });

              socket.off('reconnected', handleReconnected);
              resolve();
            };

            socket.on('reconnected', handleReconnected);
          });
        },

        // updatePlayerStatus: async (request) => {
        //   const socket = useSocketStore.getState().sockets.game;
        //   if (!socket) throw new Error('Socket not connected');

        //   return new Promise((resolve, reject) => {
        //     socket.emit('updatePlayerStatus', request, (error?: SocketError) => {
        //       if (error) {
        //         set({ error });
        //         reject(error);
        //       } else {
        //         resolve();
        //       }
        //     });
        //   });
        // },

        // updateSettings: async (request) => {
        //   const socket = useSocketStore.getState().sockets.game;
        //   if (!socket) throw new Error('Socket not connected');

        //   return new Promise((resolve, reject) => {
        //     socket.emit('updateSettings', request, (error?: SocketError) => {
        //       if (error) {
        //         set({ error });
        //         reject(error);
        //       } else {
        //         resolve();
        //       }
        //     });
        //   });
        // },

        // leaveRoom: async () => {
        //   const socket = useSocketStore.getState().sockets.game;
        //   if (!socket) throw new Error('Socket not connected');

        //   return new Promise((resolve) => {
        //     socket.emit('leaveRoom', () => {
        //       get().actions.reset();
        //       resolve();
        //     });
        //   });
        // },

        // 상태 초기화
        reset: () => {
          set(initialState);
        },
      },
    }),
    { name: 'GameSocketStore' },
  ),
);
