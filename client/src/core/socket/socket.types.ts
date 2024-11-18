import { Player, PlayerRole, RoomSettings, Room } from '@/types/game.types';

// 웹소켓 이벤트의 기본 응답 형식을 정의하는 제네릭 인터페이스
export interface SocketResponse<T = unknown> {
  data?: T;
  error?: SocketError;
}

// 웹소켓 에러 정보를 정의하는 인터페이스
export interface SocketError {
  code: SocketErrorCode;
  message: string;
  details?: Record<string, unknown>;
}

// 웹소켓 에러 코드 정의
export enum SocketErrorCode {
  // 클라이언트 에러 (4xxx)
  BAD_REQUEST = 4000,
  UNAUTHORIZED = 4001,
  FORBIDDEN = 4003,
  NOT_FOUND = 4004,
  VALIDATION_ERROR = 4400,
  RATE_LIMIT = 4429,

  // 서버 에러 (5xxx)
  INTERNAL_ERROR = 5000,
  NOT_IMPLEMENTED = 5001,
  SERVICE_UNAVAILABLE = 5003,

  // 게임 로직 에러 (6xxx)
  GAME_NOT_STARTED = 6001,
  GAME_ALREADY_STARTED = 6002,
  INVALID_TURN = 6003,
  ROOM_FULL = 6004,
  ROOM_NOT_FOUND = 6005,
  PLAYER_NOT_FOUND = 6006,
  INSUFFICIENT_PLAYERS = 6007,

  // 연결 관련 에러 (7xxx)
  CONNECTION_ERROR = 7000,
  CONNECTION_TIMEOUT = 7001,
  CONNECTION_CLOSED = 7002,
}

// ----------------------------------------------------------------

// 0. 연결 관리
export interface ReconnectRequest {
  roomId: string;
  playerId: string;
}

// 1. 방 생성 및 입장
export interface JoinRoomRequest {
  roomId: string;
}

export interface JoinRoomResponse {
  room: Room;
  roomSettings: RoomSettings;
  playerId?: string;
  player: Player[];
}

export interface PlayerLeftResponse {
  leftPlayerId: string;
  player: Player[];
}

// 2. 대기방 설정
export interface UpdateSettingsRequest {
  settings: Partial<RoomSettings>;
}

export interface UpdateSettingsResponse {
  settings: RoomSettings;
}

export interface ReadyRequest {
  isReady: boolean;
}

export interface ReadyResponse {
  playerId: string;
  isReady: boolean;
}

export interface GameStartResponse {
  countdown: number;
  roles: Record<string, PlayerRole>;
  initialWord?: string;
}

// 3. 게임 진행
export interface RoundStartResponse {
  roundNumber: number;
  roles: {
    painters?: string[];
    devil?: string;
    guessers: string[];
  };
  word?: string;
  drawTime: number;
}

export interface RoundTimeUpdateResponse {
  roundNumber: number;
  remainingTime: number;
}

export interface RoundEndResponse {
  roundNumber: number;
  word: string;
  winnerRole: PlayerRole;
  players: Player[];
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  id: string;
  playerId: string;
  nickname: string;
  message: string;
  timestamp: number;
  isCorrectAnswer?: boolean;
}

export interface DrawRequest {
  type: 'pen' | 'fill';
  color: string;
  points?: Array<{ x: number; y: number }>;
  fillPoint?: { x: number; y: number };
  brushSize?: number;
}

export interface DrawUpdateResponse {
  playerId: string;
  // TODO: 캔버스와 통일 예정
  // drawingData: DrawingData;
}

// Socket.IO 이벤트 타입 정의
export type ServerToClientEvents = {
  // 방 입장 관련
  joinedRoom: (response: JoinRoomResponse) => void;
  playerJoined: (response: JoinRoomResponse) => void;
  playerLeft: (response: PlayerLeftResponse) => void;

  // 게임 설정 관련
  settingUpdated: (response: UpdateSettingsResponse) => void;
  playerStatusUpdated: (response: ReadyResponse) => void;
  gameStarted: (response: GameStartResponse) => void;

  // 게임 진행 관련
  roundStarted: (response: RoundStartResponse) => void;
  drawTimeUpdated: (response: RoundTimeUpdateResponse) => void;
  roundEnded: (response: RoundEndResponse) => void;

  // 채팅 관련
  messageReceived: (response: ChatResponse) => void;

  // 그리기 관련
  drawUpdated: (response: DrawUpdateResponse) => void;

  // 에러 처리
  error: (error: { message: string }) => void;
};

export type ClientToServerEvents = {
  // 연결 관련
  reconnect: (request: ReconnectRequest) => void;

  // 방 입장 관련
  joinRoom: (request: JoinRoomRequest, callback: (response: JoinRoomResponse) => void) => void;

  // 게임 설정 관련
  updateSettings: (request: UpdateSettingsRequest, callback: (response: UpdateSettingsResponse) => void) => void;
  updatePlayerStatus: (request: ReadyRequest, callback: (response: ReadyResponse) => void) => void;

  // 채팅 관련
  sendMessage: (request: ChatRequest) => void;

  // 그리기 관련
  draw: (request: DrawRequest) => void;
};
