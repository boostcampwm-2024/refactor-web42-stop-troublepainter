import { SocketErrorCode } from '@troublepainter/core';
import { SocketNamespace } from '@/stores/socket/socket.config';

export const ERROR_MESSAGES: Record<SocketErrorCode, string> = {
  // 클라이언트 에러 (4xxx)
  [SocketErrorCode.BAD_REQUEST]: '잘못된 요청입니다. 다시 시도해 주세요.',
  [SocketErrorCode.UNAUTHORIZED]: '인증이 필요합니다.',
  [SocketErrorCode.FORBIDDEN]: '접근 권한이 없습니다.',
  [SocketErrorCode.NOT_FOUND]: '요청한 리소스를 찾을 수 없습니다.',
  [SocketErrorCode.VALIDATION_ERROR]: '입력 데이터가 유효하지 않습니다.',
  [SocketErrorCode.RATE_LIMIT]: '너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해주세요.',

  // 서버 에러 (5xxx)
  [SocketErrorCode.INTERNAL_ERROR]: '서버 내부 오류가 발생했습니다.',
  [SocketErrorCode.NOT_IMPLEMENTED]: '아직 구현되지 않은 기능입니다.',
  [SocketErrorCode.SERVICE_UNAVAILABLE]: '서비스를 일시적으로 사용할 수 없습니다.',

  // 게임 로직 에러 (6xxx)
  [SocketErrorCode.GAME_NOT_STARTED]: '게임이 아직 시작되지 않았습니다.',
  [SocketErrorCode.GAME_ALREADY_STARTED]: '이미 게임이 진행 중입니다.',
  [SocketErrorCode.INVALID_TURN]: '유효하지 않은 턴입니다.',
  [SocketErrorCode.ROOM_FULL]: '방이 가득 찼습니다.',
  [SocketErrorCode.ROOM_NOT_FOUND]: '해당 방을 찾을 수 없습니다.',
  [SocketErrorCode.PLAYER_NOT_FOUND]: '플레이어를 찾을 수 없습니다.',
  [SocketErrorCode.INSUFFICIENT_PLAYERS]: '게임 시작을 위한 플레이어 수가 부족합니다.',

  // 연결 관련 에러 (7xxx)
  [SocketErrorCode.CONNECTION_ERROR]: '연결 오류가 발생했습니다.',
  [SocketErrorCode.CONNECTION_TIMEOUT]: '연결 시간이 초과되었습니다.',
  [SocketErrorCode.CONNECTION_CLOSED]: '연결이 종료되었습니다.',
} as const;

export const getErrorTitle = (namespace: SocketNamespace): string => {
  switch (namespace) {
    case SocketNamespace.GAME:
      return '게임 오류';
    case SocketNamespace.DRAWING:
      return '드로잉 오류';
    case SocketNamespace.CHAT:
      return '채팅 오류';
    default:
      return '연결 오류';
  }
};
