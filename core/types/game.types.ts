export interface Player {
  playerId?: string; // 서버는 필요없음
  nickname: string;
  profileImage?: string;
  status: PlayerStatus;
  role?: PlayerRole;
  score: number;
}

export interface Room {
  roomId?: string; // 서버는 필요없음
  hostId: string;
  status: RoomStatus;
  currentRound: number;
  currentWord?: string;
}

export interface RoomSettings {
  maxPlayers: number; // 최대 플레이어 수
  drawTime: number; // 그리기 제한시간
  totalRounds: number; // 총 라운드 수
}

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
}

export enum TimerType {
  DRAWING = 'DRAWING',
  GUESSING = 'GUESSING',
  ENDING = 'ENDING',
}
