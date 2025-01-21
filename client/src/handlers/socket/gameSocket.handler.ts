import type {
  CRDTSyncMessage,
  CheckAnswerRequest,
  JoinRoomRequest,
  ReconnectRequest,
  UpdateSettingsRequest,
} from '@troublepainter/core';
import { useSocketStore } from '@/stores/socket/socket.store';
// import {
//   gameSocketConnect,
//   gameWorkerCheckAnswer,
//   gameWorkerGameStart,
//   gameWorkerJoinRoom,
//   gameWorkerReconnectRoom,
//   gameWorkerSubmitDrawing,
//   gameWorkerUpdateSetting,
// } from '@/stores/socket/gameWorker.ts';

// socket 요청만 처리하는 핸들러
export const gameSocketHandlers = {
  joinRoom: (request: JoinRoomRequest) => {
    const socket = useSocketStore.getState().sockets.game;
    if (!socket) throw new Error('Socket not connected');

    socket.emit('joinRoom', request);
    // gameSocketConnect();
    //
    // // 약간의 지연 후 joinRoom 실행
    // setTimeout(() => {
    //   gameWorkerJoinRoom(request);
    // }, 100);
  },

  reconnect: (request: ReconnectRequest) => {
    const socket = useSocketStore.getState().sockets.game;
    if (!socket) throw new Error('Socket not connected');

    socket.emit('reconnect', request);
    // gameWorkerReconnectRoom(request);
  },

  updateSettings: (request: UpdateSettingsRequest) => {
    const socket = useSocketStore.getState().sockets.game;
    if (!socket) throw new Error('Socket not connected');

    socket.emit('updateSettings', request);
    // gameWorkerUpdateSetting(request);
  },

  gameStart: () => {
    const socket = useSocketStore.getState().sockets.game;
    if (!socket) throw new Error('Socket not connected');

    socket.emit('gameStart');
    // gameWorkerGameStart();
  },

  checkAnswer: (request: CheckAnswerRequest) => {
    const socket = useSocketStore.getState().sockets.game;
    if (!socket) throw new Error('Socket not connected');

    socket.emit('checkAnswer', request);
    // gameWorkerCheckAnswer(request);
  },

  submittedDrawing: (drawing: CRDTSyncMessage) => {
    const socket = useSocketStore.getState().sockets.game;
    if (!socket) throw new Error('Socket not connected');

    socket.emit('submittedDrawing', { drawing });
    // gameWorkerSubmitDrawing(drawing);
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
