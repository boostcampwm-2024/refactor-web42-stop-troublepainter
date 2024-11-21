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
  settings: RoomSettings;
  status: RoomStatus;
  currentRound: number;
  totalRounds: number;
  currentWord?: string;
}

export interface RoomSettings {
  maxPlayers: number; // 최대 플레이어 수
  drawTime: number; // 그리기 제한시간
  totalRounds: number; // 총 라운드 수
  maxPixels: number; // 그리기 제한 픽셀
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
  IN_GAME = 'IN_GAME',
}
