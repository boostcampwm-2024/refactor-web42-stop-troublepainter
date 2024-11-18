import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Player, PlayerStatus, Room, RoomSettings, RoomStatus } from 'src/types/game.types';
import { RedisService } from 'src/redis/redis.service';
import { v4 } from 'uuid';

@Injectable()
export class GameService {
  private readonly DEFAULT_ROOM_SETTINGS: RoomSettings = {
    maxPlayers: 5,
    totalRounds: 5,
    drawTime: 30,
  };

  constructor(private readonly redisService: RedisService) {}

  async createRoom(): Promise<string> {
    const roomId = v4();
    const roomSettingsKey = `room:${roomId}:settings`;
    const roomKey = `room:${roomId}`;

    const roomSettings: RoomSettings = {
      ...this.DEFAULT_ROOM_SETTINGS,
    };

    const room: Room = {
      roomId: roomId,
      hostId: null,
      status: RoomStatus.WAITING,
      currentRound: 0,
      totalRounds: this.DEFAULT_ROOM_SETTINGS.totalRounds,
      currentWord: null,
    };

    const multi = this.redisService.multi();
    multi.hset(roomSettingsKey, roomSettings);
    multi.hset(roomKey, room);

    await multi.exec();

    return roomId;
  }

  async joinRoom(roomId: string) {
    const room = await this.getRoom(roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const players = await this.redisService.lrangeAll(`room:${roomId}:players`);

    const roomSettings = await this.getRoomSettings(roomId);
    if (players.length >= roomSettings.maxPlayers) {
      throw new BadRequestException('Room is full');
    }

    const playerId = v4();
    if (players.length === 0) {
      room.hostId = playerId;
    }

    const player: Player = {
      playerId,
      role: null,
      status: PlayerStatus.NOT_READY,
      nickname: `Player ${players.length + 1}`,
      profileImage: null,
      score: 0,
    };

    const multi = this.redisService.multi();
    multi.lpush(`room:${roomId}:players`, playerId);
    multi.hset(`room:${roomId}`, room);
    multi.hset(`room:${roomId}:players:${playerId}`, player);

    await multi.exec();

    return { room, roomSettings, player };
  }

  async getRoom(roomId: string) {
    const room = await this.redisService.hgetall(`room:${roomId}`);
    if (Object.keys(room).length === 0) return null;

    return {
      roomId: room.roomId,
      hostId: room.hostId === '' ? null : room.hostId,
      status: room.status as RoomStatus,
      currentRound: parseInt(room.currentRound),
      totalRounds: parseInt(room.totalRounds),
      currentWord: room.currentWord === '' ? null : room.currentWord,
    };
  }

  async getRoomPlayers(roomId: string) {
    const playerIds = await this.redisService.lrangeAll(`room:${roomId}:players`);

    if (!playerIds.length) return [];

    const players = await Promise.all(
      playerIds.map(async (playerId) => {
        const player = await this.redisService.hgetall(`room:${roomId}:players:${playerId}`);
        if (!player || Object.keys(player).length === 0) return null;

        return {
          ...player,
          role: player.role === '' ? null : player.role,
          profileImage: player.userImg === '' ? null : player.userImg,
          score: parseInt(player.score as string),
        } as Player;
      }),
    );
    return players.filter(Boolean);
  }

  async getRoomSettings(roomId: string) {
    const settings = await this.redisService.hgetall(`room:${roomId}:settings`);
    return {
      maxPlayers: parseInt(settings.maxPlayers),
      totalRounds: parseInt(settings.totalRounds),
      drawTime: parseInt(settings.drawTime),
    } as RoomSettings;
  }

  async removePlayer(roomId: string, playerId: string) {
    const room = await this.getRoom(roomId);
    if (!room) return null;

    const players = await this.redisService.lrangeAll(`room:${roomId}:players`);
    if (!players.includes(playerId)) return room;

    const multi = this.redisService.multi();

    multi.lrem(`room:${roomId}:players`, 0, playerId);
    multi.del(`room:${roomId}:players:${playerId}`);

    if (room.hostId === playerId) {
      const remainingPlayers = players.filter((p) => p !== playerId);
      if (remainingPlayers.length > 0) {
        room.hostId = remainingPlayers[0];
        multi.hset(`room:${roomId}`, room);
      } else {
        multi.del(`room:${roomId}`);
        multi.del(`room:${roomId}:settings`);
        return null;
      }
    }

    await multi.exec();
    return room;
  }
}
