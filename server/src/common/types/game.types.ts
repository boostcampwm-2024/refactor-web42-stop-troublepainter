import { PlayerRole, PlayerStatus, RoomStatus } from '../enums/game.status.enum';

export interface Player {
  playerId: string;
  role: PlayerRole | null;
  status: PlayerStatus;
  nickname: string;
  profileImage: string | null;
  score: number;
}

export interface Room {
  roomId: string;
  hostId: string | null;
  status: RoomStatus;
  currentRound?: number;
  currentWord?: string;
}

export interface RoomSettings {
  maxPlayers: number;
  totalRounds: number;
  drawTime: number;
}
