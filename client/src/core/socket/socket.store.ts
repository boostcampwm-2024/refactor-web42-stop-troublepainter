import { create } from 'zustand';
import type { Socket } from 'socket.io-client';
import {
  handleSocketError,
  SocketNamespace,
  SocketAuth,
  NAMESPACE_AUTH_REQUIRED,
  socketCreators,
} from '@/core/socket/socket.config';

interface SocketState {
  sockets: Record<SocketNamespace, Socket | null>;
  connected: Record<SocketNamespace, boolean>;
  actions: {
    connect: (namespace: SocketNamespace, auth?: SocketAuth) => void;
    disconnect: (namespace: SocketNamespace) => void;
    disconnectAll: () => void;
  };
}

export const useSocketStore = create<SocketState>((set, get) => ({
  sockets: {
    [SocketNamespace.GAME]: null,
    [SocketNamespace.DRAWING]: null,
    [SocketNamespace.CHAT]: null,
  },
  connected: {
    [SocketNamespace.GAME]: false,
    [SocketNamespace.DRAWING]: false,
    [SocketNamespace.CHAT]: false,
  },
  actions: {
    connect: (namespace: SocketNamespace, auth?: SocketAuth) => {
      const currentSocket = get().sockets[namespace];
      if (currentSocket?.connected) return;

      // auth 필요 여부 체크
      if (NAMESPACE_AUTH_REQUIRED[namespace] && !auth) {
        console.error(`Auth is required for ${namespace} socket connection`);
        return;
      }

      const socket = socketCreators[namespace](auth);

      socket.on('connect', () => {
        set((state) => ({
          connected: {
            ...state.connected,
            [namespace]: true,
          },
        }));
      });

      socket.on('disconnect', () => {
        set((state) => ({
          connected: {
            ...state.connected,
            [namespace]: false,
          },
        }));
      });

      socket.on('error', (error) => {
        handleSocketError(error, namespace);
      });

      socket.connect();

      set((state) => ({
        sockets: {
          ...state.sockets,
          [namespace]: socket,
        },
      }));
    },

    disconnect: (namespace: SocketNamespace) => {
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
      Object.values(SocketNamespace).forEach((namespace) => {
        get().actions.disconnect(namespace);
      });
    },
  },
}));
