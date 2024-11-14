// 웹소켓 서버 응답 기본 형태
export interface SocketResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// 유저 관련 타입
export type UserRole = '그림꾼' | '방해꾼' | '구경꾼';
export type PainterRole = '그림꾼' | '방해꾼';
export type UserStatus = 'notReady' | 'ready' | 'gaming';
export type UserRank = 1 | 2 | 3;

// 유저 정보
export interface User {
  id: string;
  username: string;
  status: UserStatus;
  role?: UserRole;
  score: number;
  rank?: UserRank;
  profileImage?: string;
}

// 방 상태
export interface Room {
  roomId: string;
  players: User[];
  hostId: string;
  currentRound: number;
  totalRounds: number; // 3 고정
  maxPlayers: number; // 4 고정
  currentWord?: string;
  timeRemaining: number; // 30초 시작
  roundStartTime?: number;
}

// 그리기 관련 타입
export type Point = {
  x: number;
  y: number;
};

export type DrawingMode = 'pen' | 'fill'; // CanvasUI.tsx에서 사용 중

export interface DrawingData {
  type: DrawingMode;
  color: string;
  brushSize?: number;
  points?: Point[];
  startPoint?: Point;
  inkRemaining: number;
}

// 게임 이벤트
export interface GameEvent {
  type: 'ready' | 'start' | 'answer' | 'timeUp';
  roomId: string;
  userId: string;
  data: {
    word?: string;
    answer?: string;
    isCorrect?: boolean;
  };
}

// Socket.IO 이벤트 타입 정의
export type ServerToClientEvents = {
  playerJoined: (data: { playerId: string; room: Room }) => void;
  drawUpdate: (data: DrawingData) => void;
};

export type ClientToServerEvents = {
  createRoom: (callback: (response: SocketResponse<Room>) => void) => void;
  joinRoom: (roomId: string, callback: (response: SocketResponse<Room>) => void) => void;
  drawing: (data: { roomId: string } & DrawingData, callback: (response: SocketResponse<void>) => void) => void;
};
