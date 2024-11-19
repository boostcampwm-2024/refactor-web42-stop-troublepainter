import { io } from 'socket.io-client';
import type { ChatSocket, DrawingSocket, GameSocket, SocketError } from '@/core/socket/socket.types';

const SOCKET_CONFIG = {
  URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000',
  OPTIONS: {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  },
};

// 게임 소켓
export const createGameSocket = () => io(`${SOCKET_CONFIG.URL}/game`, SOCKET_CONFIG.OPTIONS) as GameSocket;

// 드로잉 소켓
export const createDrawingSocket = () => io(`${SOCKET_CONFIG.URL}/drawing`, SOCKET_CONFIG.OPTIONS) as DrawingSocket;

// 채팅 소켓
export const createChatSocket = () => io(`${SOCKET_CONFIG.URL}/chat`, SOCKET_CONFIG.OPTIONS) as ChatSocket;

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
