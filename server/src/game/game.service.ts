import { Injectable } from '@nestjs/common';
import { Player, Room, RoomSettings } from 'src/common/types/game.types';
import { v4 } from 'uuid';
import { GameRepository } from './game.repository';
import {
  PlayerNotFoundException,
  RoomFullException,
  RoomNotFoundException,
  BadRequestException,
  InsufficientPlayersException,
} from 'src/exceptions/game.exception';
import { RoomStatus, PlayerStatus, PlayerRole } from 'src/common/enums/game.status.enum';

@Injectable()
export class GameService {
  private readonly DEFAULT_ROOM_SETTINGS: RoomSettings = {
    maxPlayers: 5,
    totalRounds: 5,
    drawTime: 30,
  };

  constructor(private readonly gameRepository: GameRepository) {}

  async createRoom(): Promise<string> {
    const roomId = v4();
    const room: Room = {
      roomId: roomId,
      hostId: null,
      status: RoomStatus.WAITING,
      currentRound: 0,
      currentWord: null,
    };

    await this.gameRepository.createRoom(roomId, room, this.DEFAULT_ROOM_SETTINGS);

    return roomId;
  }

  async joinRoom(roomId: string) {
    const [room, roomSettings, players] = await Promise.all([
      this.gameRepository.getRoom(roomId),
      this.gameRepository.getRoomSettings(roomId),
      this.gameRepository.getRoomPlayers(roomId),
    ]);

    if (!room) throw new RoomNotFoundException();
    if (!roomSettings) throw new RoomNotFoundException('Room settings not found');
    if (players.length >= roomSettings.maxPlayers) {
      throw new RoomFullException('Room is full');
    }

    const playerId = v4();
    const player: Player = {
      playerId,
      role: null,
      status: PlayerStatus.NOT_PLAYING,
      nickname: `Player ${players.length + 1}`,
      profileImage: null,
      score: 0,
    };

    const isFirstPlayer = players.length === 0;
    if (isFirstPlayer) {
      room.hostId = playerId;
      await this.gameRepository.updateRoom(roomId, { hostId: playerId });
    }

    await this.gameRepository.addPlayerToRoom(roomId, playerId, player);

    const updatedPlayers = [player, ...players].reverse();

    return { room, roomSettings, player, players: updatedPlayers };
  }

  async reconnect(roomId: string, playerId: string) {
    const [room, roomSettings, players] = await Promise.all([
      this.gameRepository.getRoom(roomId),
      this.gameRepository.getRoomSettings(roomId),
      this.gameRepository.getRoomPlayers(roomId),
    ]);

    if (!room) throw new RoomNotFoundException('Room not found');
    if (!roomSettings) throw new RoomNotFoundException('Room settings not found');

    const existingPlayer = players.find((p) => p.playerId === playerId);
    if (!existingPlayer) throw new PlayerNotFoundException('Player not found');

    return { room, players, roomSettings };
  }

  async leaveRoom(roomId: string, playerId: string) {
    const [room, players] = await Promise.all([
      this.gameRepository.getRoom(roomId),
      this.gameRepository.getRoomPlayers(roomId),
    ]);

    if (!room) throw new RoomNotFoundException('Room not found');
    if (!players.some((p) => p.playerId === playerId)) throw new PlayerNotFoundException('Player not found');

    const remainingPlayers = players.filter((p) => p.playerId !== playerId);
    await this.gameRepository.removePlayerFromRoom(roomId, playerId);

    if (remainingPlayers.length === 0) {
      await this.gameRepository.deleteRoom(roomId);
      return { hostId: null, remainingPlayers: [] };
    }

    let hostId = room.hostId;
    if (hostId === playerId) {
      hostId = remainingPlayers[remainingPlayers.length - 1].playerId;
      await this.gameRepository.updateRoom(roomId, { hostId });
    }

    await this.gameRepository.removePlayerFromRoom(roomId, playerId);

    // Todo: When someone leaves, move them to the waiting room

    return { hostId, remainingPlayers };
  }

  async updateSettings(roomId: string, playerId: string, data: Partial<RoomSettings>) {
    const room = await this.gameRepository.getRoom(roomId);
    if (!room) throw new RoomNotFoundException('Room not found');
    if (room.hostId !== playerId) throw new BadRequestException('Player is not the host');

    const roomSettings = await this.gameRepository.getRoomSettings(roomId);

    const updatedSettings = { ...roomSettings, ...data };
    await this.gameRepository.updateRoomSettings(roomId, updatedSettings);

    return updatedSettings;
  }

  async startGame(roomId: string, playerId: string) {
    const room = await this.gameRepository.getRoom(roomId);
    if (!room) throw new RoomNotFoundException('Room not found');
    if (room.hostId !== playerId) throw new BadRequestException('Player is not the host');

    const roomSettings = await this.gameRepository.getRoomSettings(roomId);

    const roomUpdates = {
      status: RoomStatus.IN_GAME,
      currentRound: room.currentRound + 1,
      currentWord: '바보',
    };
    await this.gameRepository.updateRoom(roomId, roomUpdates);

    const players = await this.gameRepository.getRoomPlayers(roomId);
    if (!players || players.length < 4) {
      throw new InsufficientPlayersException('Not enough players to start game');
    }

    const playersWithRoles = await this.distributeRoles(roomId, players);

    const roles = this.categorizePlayerRoles(playersWithRoles);

    return { room: { ...room, roomUpdates }, roomSettings, roles, players: playersWithRoles };
  }

  private async distributeRoles(roomId: string, players: Player[]) {
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const playerUpdates = shuffledPlayers.map((player, index) => ({
      playerId: player.playerId,
      updates: {
        status: PlayerStatus.PLAYING,
        role: this.determineRole(index),
      },
    }));

    await Promise.all(
      playerUpdates.map(({ playerId, updates }) => this.gameRepository.updatePlayer(roomId, playerId, updates)),
    );

    return shuffledPlayers.map((player, i) => ({
      ...player,
      ...playerUpdates[i].updates,
    }));
  }

  private determineRole(index: number): PlayerRole {
    if (index < 2) return PlayerRole.PAINTER;
    if (index === 2) return PlayerRole.DEVIL;
    return PlayerRole.GUESSER;
  }

  private categorizePlayerRoles(players: Player[]) {
    return players.reduce(
      (acc, { playerId, role }) => {
        if (role === PlayerRole.PAINTER) acc.painters.push(playerId);
        else if (role === PlayerRole.DEVIL) acc.devils.push(playerId);
        else if (role === PlayerRole.GUESSER) acc.guessers.push(playerId);
        return acc;
      },
      { painters: [], devils: [], guessers: [] },
    );
  }
}
