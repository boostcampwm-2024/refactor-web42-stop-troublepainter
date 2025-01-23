import type {
  CRDTSyncMessage,
  CheckAnswerRequest,
  JoinRoomRequest,
  ReconnectRequest,
  UpdateSettingsRequest,
} from '@troublepainter/core';
import {
  gameWorkerCheckAnswer,
  gameWorkerGameStart,
  gameWorkerJoinRoom,
  gameWorkerReconnectRoom,
  gameWorkerSubmitDrawing,
  gameWorkerUpdateSetting,
} from '@/stores/socket/gameWorker.ts';

// socket 요청만 처리하는 핸들러
export const gameSocketHandlers = {
  joinRoom: (request: JoinRoomRequest) => {
    // 약간의 지연 후 joinRoom 실행
    gameWorkerJoinRoom(request);
  },

  reconnect: (request: ReconnectRequest) => {
    gameWorkerReconnectRoom(request);
  },

  updateSettings: (request: UpdateSettingsRequest) => {
    gameWorkerUpdateSetting(request);
  },

  gameStart: () => {
    gameWorkerGameStart();
  },

  checkAnswer: (request: CheckAnswerRequest) => {
    gameWorkerCheckAnswer(request);
  },

  submittedDrawing: (drawing: CRDTSyncMessage) => {
    gameWorkerSubmitDrawing(drawing);
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
};

export type GameSocketHandlers = typeof gameSocketHandlers;
