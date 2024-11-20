import { create } from 'zustand';
import type { Socket } from 'socket.io-client';
import {
  handleSocketError,
  SocketNamespace,
  SocketAuth,
  NAMESPACE_AUTH_REQUIRED,
  socketCreators,
} from '@/stores/socket/socket.config';

interface SocketState {
  sockets: Record<SocketNamespace, Socket | null>;
  connected: Record<SocketNamespace, boolean>;
  actions: {
    connect: (namespace: SocketNamespace, auth?: SocketAuth) => void;
    disconnect: (namespace: SocketNamespace) => void;
    disconnectAll: () => void;
  };
}

/**
 * 전역 소켓 연결을 관리하는 Store입니다.
 *
 * @remarks
 * 다중 소켓(게임, 채팅, 드로잉)의 연결 상태와 인스턴스를 중앙 관리합니다.
 * 재사용 가능한 연결 관리 로직을 제공하여 각 네임스페이스별 훅에서 활용합니다.
 *
 * @example
 * ```typescript
 * const { sockets, connected, actions } = useSocketStore();
 *
 * // 특정 네임스페이스 소켓 연결
 * actions.connect(SocketNamespace.GAME);
 *
 * // 연결 상태 확인
 * if (connected.game) {
 *   // 소켓 사용
 * }
 * ```
 *
 * @category Store
 */
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
      // console.log(socket);

      socket.on('connect', () => {
        // console.log(namespace, '소켓 연결');

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
