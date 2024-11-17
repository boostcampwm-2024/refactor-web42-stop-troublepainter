export interface Player {
    role: PlayerRole;
    status: PlayerStatus;
    nickName: string;
    userImg: string | null;
    score: number;
}
  
export interface Room {
    hostId: string | null;
    players: Player[];
    status: RoomStatus;
    currentRound?: number;
    totalRounds?: number;
    currentWord?: string;
}

export interface RoomSettings {
    maxPlayers: number;
    totalRounds: number; 
    drawTime: number;
}

export enum PlayerStatus {
    NOT_READY = 'NOT_READY',
    READY = 'READY',
    PLAYING = 'PLAYING'
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