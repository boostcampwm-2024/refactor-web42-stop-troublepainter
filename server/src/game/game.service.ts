import { Injectable } from '@nestjs/common';
import { Player, Room, RoomSettings } from 'src/common/types/game.types';
import { v4 } from 'uuid';
import { GameRepository } from './game.repository';
import { PlayerNotFoundException, RoomFullException, RoomNotFoundException } from 'src/exceptions/game.exception';
import { RoomStatus, PlayerStatus } from 'src/common/enums/game.status.enum';

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
      totalRounds: this.DEFAULT_ROOM_SETTINGS.totalRounds,
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
      status: PlayerStatus.NOT_READY,
      nickname: `Player ${players.length + 1}`,
      profileImage: null,
      score: 0,
    };

    const isFirstPlayer = players.length === 0;
    if (isFirstPlayer) {
      room.hostId = playerId;
      await this.gameRepository.updateRoom(roomId, room);
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
      this.gameRepository.getRoomPlayers(roomId)
    ]);

    if (!room) throw new RoomNotFoundException('Room not found');
    if (!players.some((p) => p.playerId === playerId)) throw new PlayerNotFoundException('Player not found');

    const remainingPlayers = players.filter((p) => p.playerId !== playerId);
    if (remainingPlayers.length === 0) {
        await this.gameRepository.deleteRoom(roomId);
        return null;
    }

    if (room.hostId === playerId) {
      room.hostId = remainingPlayers[0].playerId;
      await this.gameRepository.updateRoom(roomId, room);
    }

    await this.gameRepository.removePlayerFromRoom(roomId, playerId);

    return remainingPlayers;
  }
}
