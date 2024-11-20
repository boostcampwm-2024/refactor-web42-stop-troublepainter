import { SocketError } from '@troublepainter/core';
import { io } from 'socket.io-client';
import { ChatSocket, DrawingSocket, GameSocket } from '@/types/socket.types';

/**
 * 소켓 연결 설정과 관리를 위한 구성 모듈입니다.
 *
 * @remarks
 * 웹소켓 연결에 필요한 설정, 타입, 유틸리티 함수들을 정의합니다.
 * 게임, 드로잉, 채팅 각각의 소켓 연결을 타입 안전하게 관리합니다.
 *
 * @example
 * ```typescript
 * // 게임 소켓 생성
 * const gameSocket = socketCreators[SocketNamespace.GAME]();
 *
 * // 인증이 필요한 드로잉 소켓 생성
 * const drawingSocket = socketCreators[SocketNamespace.DRAWING]({
 *   roomId: "room123",
 *   playerId: "player456"
 * });
 * ```
 *
 * @category Socket
 */

/**
 * 소켓 인증에 필요한 정보 인터페이스입니다.
 */
export interface SocketAuth {
  /** 방 식별자 */
  roomId: string;
  /** 플레이어 식별자 */
  playerId: string;
}

/**
 * 소켓 네임스페이스 열거형 타입입니다.
 * @enum
 */
export enum SocketNamespace {
  /** 게임 상태 관리용 소켓 */
  GAME = 'game',
  /** 실시간 드로잉용 소켓 */
  DRAWING = 'drawing',
  /** 채팅용 소켓 */
  CHAT = 'chat',
}

/**
 * 소켓 연결 설정 인터페이스입니다.
 */
export interface SocketConnectionConfig {
  /** 소켓 네임스페이스 */
  namespace: SocketNamespace;
  /** 인증 정보 (선택적) */
  auth?: SocketAuth;
}

/**
 * 네임스페이스별 인증 요구사항입니다. GAME 소켓을 제외한 나머지는 요구함을 명시합니다.
 * @constant
 */
export const NAMESPACE_AUTH_REQUIRED: Record<SocketNamespace, boolean> = {
  [SocketNamespace.GAME]: false,
  [SocketNamespace.DRAWING]: true,
  [SocketNamespace.CHAT]: true,
} as const;

/**
 * 소켓 설정을 정의한 상수입니다.
 * @constant
 */
export const SOCKET_CONFIG = {
  /** 소켓 서버 URL */
  URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000',
  /** 기본 소켓 옵션 */
  BASE_OPTIONS: {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  },
  /** 네임스페이스별 경로 */
  PATHS: {
    [SocketNamespace.GAME]: '/game',
    [SocketNamespace.DRAWING]: '/drawing',
    [SocketNamespace.CHAT]: '/chat',
  },
} as const;

/** 소켓 타입 유니온 */
type SocketType = GameSocket | DrawingSocket | ChatSocket;

/** 네임스페이스별 소켓 타입 매핑 */
type NamespaceSocketMap = {
  [SocketNamespace.GAME]: GameSocket;
  [SocketNamespace.DRAWING]: DrawingSocket;
  [SocketNamespace.CHAT]: ChatSocket;
};

/** 타입별 소켓 생성 함수 타입 */
type SocketCreator<T extends SocketType> = (auth?: SocketAuth) => T;

/**
 * 타입 안전한 소켓 생성 함수입니다.
 *
 * @typeParam T - 소켓 타입
 * @param namespace - 소켓 네임스페이스
 * @param auth - 인증 정보 (선택적)
 * @returns 생성된 소켓 인스턴스
 */
const createSocket = <T extends SocketType>(namespace: SocketNamespace, auth?: SocketAuth): T => {
  const options = auth ? { ...SOCKET_CONFIG.BASE_OPTIONS, auth } : SOCKET_CONFIG.BASE_OPTIONS;
  return io(`${SOCKET_CONFIG.URL}${SOCKET_CONFIG.PATHS[namespace]}`, options) as T;
};

/**
 * 네임스페이스별 소켓 생성 함수들입니다.
 * @constant
 */
export const socketCreators: {
  [K in SocketNamespace]: SocketCreator<NamespaceSocketMap[K]>;
} = {
  [SocketNamespace.GAME]: () => createSocket<GameSocket>(SocketNamespace.GAME),
  [SocketNamespace.DRAWING]: (auth) => createSocket<DrawingSocket>(SocketNamespace.DRAWING, auth),
  [SocketNamespace.CHAT]: (auth) => createSocket<ChatSocket>(SocketNamespace.CHAT, auth),
};

/**
 * 소켓 에러 처리 함수입니다.
 *
 * @param error - 소켓 에러 객체
 * @param namespace - 에러가 발생한 네임스페이스
 */
export const handleSocketError = (error: SocketError, namespace: string) => {
  console.error(`Socket Error (${namespace}):`, error);
  // TODO: 에러 추적 서비스에 로깅
  // TODO: 사용자에게 에러 알림 (토스트 등)
};
