import { SocketError } from '@troublepainter/core';
import { io } from 'socket.io-client';
import { ChatSocket, DrawingSocket, GameSocket } from '@/types/socket.types';

// 기본 auth 관련 타입 정의
export interface SocketAuth {
  roomId: string;
  playerId: string;
}

// Socket 네임스페이스 타입
export enum SocketNamespace {
  GAME = 'game',
  DRAWING = 'drawing',
  CHAT = 'chat',
}

// Socket 연결 설정 타입
export interface SocketConnectionConfig {
  namespace: SocketNamespace;
  auth?: SocketAuth;
}

// 인증 요구사항 명시화: 네임스페이스별 Auth 필요 여부
export const NAMESPACE_AUTH_REQUIRED: Record<SocketNamespace, boolean> = {
  [SocketNamespace.GAME]: false,
  [SocketNamespace.DRAWING]: true,
  [SocketNamespace.CHAT]: true,
} as const;

// 설정 중앙화: 소켓 설정
export const SOCKET_CONFIG = {
  URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000',
  BASE_OPTIONS: {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  },
  PATHS: {
    [SocketNamespace.GAME]: '/game',
    [SocketNamespace.DRAWING]: '/drawing',
    [SocketNamespace.CHAT]: '/chat',
  },
} as const;

// 소켓 타입 유니온
type SocketType = GameSocket | DrawingSocket | ChatSocket;

// 네임스페이스별 소켓 타입 매핑
type NamespaceSocketMap = {
  [SocketNamespace.GAME]: GameSocket;
  [SocketNamespace.DRAWING]: DrawingSocket;
  [SocketNamespace.CHAT]: ChatSocket;
};

// 타입별 소켓 생성 함수 타입
type SocketCreator<T extends SocketType> = (auth?: SocketAuth) => T;

// 제네릭 소켓 생성 함수
const createSocket = <T extends SocketType>(namespace: SocketNamespace, auth?: SocketAuth): T => {
  const options = auth ? { ...SOCKET_CONFIG.BASE_OPTIONS, auth } : SOCKET_CONFIG.BASE_OPTIONS;

  return io(`${SOCKET_CONFIG.URL}${SOCKET_CONFIG.PATHS[namespace]}`, options) as T;
};

// 타입 안전한 소켓 생성 함수들
export const socketCreators: {
  [K in SocketNamespace]: SocketCreator<NamespaceSocketMap[K]>;
} = {
  [SocketNamespace.GAME]: () => createSocket<GameSocket>(SocketNamespace.GAME),
  [SocketNamespace.DRAWING]: (auth) => createSocket<DrawingSocket>(SocketNamespace.DRAWING, auth),
  [SocketNamespace.CHAT]: (auth) => createSocket<ChatSocket>(SocketNamespace.CHAT, auth),
};

// 공통 에러 핸들러
export const handleSocketError = (error: SocketError, namespace: string) => {
  console.error(`Socket Error (${namespace}):`, error);
  // TODO: 에러 추적 서비스에 로깅
  // TODO: 사용자에게 에러 알림 (토스트 등)
};

// Store (gameSocket.store.ts)
// * 소켓 인스턴스 관리
// * 연결 상태
// * 기본적인 room/player 데이터
// * 단순 데이터 업데이트 함수들
// Custom Hook (useGameSocket.ts)
// * Socket 이벤트 리스너 관리
// * 재사용 가능한 소켓 관련 로직
// * 컴포넌트 생명주기와 관련된 처리
// * 복잡한 비즈니스 로직
