import { SocketErrorCode } from "../common/enums/socket.error-code.enum";

export class GameException extends Error {
  constructor(
    public readonly code: SocketErrorCode,
      message: string,
  ) {
    super(message);
  }
}

export class RoomFullException extends GameException {
  constructor(message: string = 'Room is full') {
    super(SocketErrorCode.ROOM_FULL, message);
  }
}

export class RoomNotFoundException extends GameException {
  constructor(message: string = 'Room not found') {
    super(SocketErrorCode.ROOM_NOT_FOUND, message);
  }
}

export class PlayerNotFoundException extends GameException {
  constructor(message: string = 'Player not found') {
    super(SocketErrorCode.PLAYER_NOT_FOUND, message);
  }
}

export class BadRequestException extends GameException {
  constructor(message: string = 'Bad request') {
    super(SocketErrorCode.BAD_REQUEST, message);
  }
}