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
