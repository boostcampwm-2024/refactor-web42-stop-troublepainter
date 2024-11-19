import { create } from 'zustand';
import type { Socket } from 'socket.io-client';
import {
  createGameSocket,
  createDrawingSocket,
  createChatSocket,
  handleSocketError,
} from '@/core/socket/socket.config';

interface SocketState {
  sockets: {
    game: Socket | null;
    drawing: Socket | null;
    chat: Socket | null;
  };
  connected: {
    game: boolean;
    drawing: boolean;
    chat: boolean;
  };
  actions: {
    connect: (namespace: keyof SocketState['sockets']) => void;
    disconnect: (namespace: keyof SocketState['sockets']) => void;
    disconnectAll: () => void;
  };
}

const socketCreators = {
  game: createGameSocket,
  drawing: createDrawingSocket,
  chat: createChatSocket,
};

export const useSocketStore = create<SocketState>((set, get) => ({
  sockets: {
    game: null,
    drawing: null,
    chat: null,
  },
  connected: {
    game: false,
    drawing: false,
    chat: false,
  },
  actions: {
    connect: (namespace) => {
      const currentSocket = get().sockets[namespace];
      if (currentSocket?.connected) return;

      const newSocket = socketCreators[namespace]();

      newSocket.on('connect', () => {
        set((state) => ({
          connected: {
            ...state.connected,
            [namespace]: true,
          },
        }));
      });

      newSocket.on('disconnect', () => {
        set((state) => ({
          connected: {
            ...state.connected,
            [namespace]: false,
          },
        }));
      });

      newSocket.on('error', (error) => {
        handleSocketError(error, namespace);
      });

      newSocket.connect();

      set((state) => ({
        sockets: {
          ...state.sockets,
          [namespace]: newSocket,
        },
      }));
    },
    disconnect: (namespace) => {
      const socket = get().sockets[namespace];
      if (socket) {
        socket.disconnect();
        set((state) => ({
          sockets: {
            ...state.sockets,
            [namespace]: null,
          },
          connected: {
            ...state.connected,
            [namespace]: false,
          },
        }));
      }
    },
    disconnectAll: () => {
      Object.keys(get().sockets).forEach((namespace) => {
        get().actions.disconnect(namespace as keyof SocketState['sockets']);
      });
    },
  },
}));
