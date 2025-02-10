export enum PlayerStatus {
  NOT_PLAYING = 'NOT_PLAYING',
  PLAYING = 'PLAYING',
}

export enum PlayerRole {
  PAINTER = 'PAINTER',
  DEVIL = 'DEVIL',
  GUESSER = 'GUESSER',
}

export enum RoomStatus {
  WAITING = 'WAITING',
  DRAWING = 'DRAWING',
  GUESSING = 'GUESSING',
  OCR = 'OCR',
}

export enum Difficulty {
  EASY = 'EASY',
  NORMAL = 'NORMAL',
  HARD = 'HARD',
}

export enum TerminationType {
  SUCCESS = 'SUCCESS',
  PLAYER_DISCONNECT = 'PLAYER_DISCONNECT',
}
