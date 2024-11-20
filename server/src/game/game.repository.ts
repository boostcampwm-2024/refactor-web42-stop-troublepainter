import { Injectable } from "@nestjs/common";
import { RedisService } from "src/redis/redis.service";
import { Player, Room, RoomSettings } from "src/common/types/game.types";
import { RoomStatus } from "src/common/enums/game.status.enum";

@Injectable()
export class GameRepository {
    constructor(private readonly redisService: RedisService) {}
    
    async createRoom(roomId: string, room: Room, settings: RoomSettings) {
        const multi = this.redisService.multi();
        multi.hset(`room:${roomId}`, room);
        multi.hset(`room:${roomId}:settings`, settings);
        await multi.exec();
    }

    async getRoom(roomId: string) {
        const room = await this.redisService.hgetall(`room:${roomId}`);
        if (!room || Object.keys(room).length === 0) return null;

        return {
            roomId: room.roomId,
            hostId: room.hostId === '' ? null : room.hostId,
            status: room.status as RoomStatus,
            currentRound: parseInt(room.currentRound, 10) || 0,
            totalRounds: parseInt(room.totalRounds, 10) || 0,
            currentWord: room.currentWord === '' ? null : room.currentWord,
        } as Room;
    }

    async updateRoom(roomId: string, room: Room) {
        await this.redisService.hset(`room:${roomId}`, room);
    }

    async deleteRoom(roomId: string): Promise<void> {
        const multi = this.redisService.multi();
        multi.del(`room:${roomId}`);
        multi.del(`room:${roomId}:settings`);
        await multi.exec();
    }

    async getRoomSettings(roomId: string) {
        const settings = await this.redisService.hgetall(`room:${roomId}:settings`);
        return {
            maxPlayers: parseInt(settings.maxPlayers, 10),
            totalRounds: parseInt(settings.totalRounds, 10),
            drawTime: parseInt(settings.drawTime, 10),
        } as RoomSettings;
    }

    async getRoomPlayers(roomId: string): Promise<Player[]> {
        const playerIds = await this.redisService.lrangeAll(`room:${roomId}:players`);
        if (!playerIds || playerIds.length === 0) return [];

        const players = await Promise.all(
          playerIds.map(async (playerId) => {
            const player = await this.redisService.hgetall(`room:${roomId}:players:${playerId}`);
            if (!player || Object.keys(player).length === 0) return null;
            return {
              ...player,
              role: player.role === '' ? null : player.role,
              profileImage: player.userImg === '' ? null : player.userImg,
              score: parseInt(player.score, 10) || 0,
            } as Player;
          }),
        );
        return players.filter(Boolean);
    }

    async addPlayerToRoom(roomId: string, playerId: string, player: Player) {
        const multi = this.redisService.multi();
        multi.lpush(`room:${roomId}:players`, playerId);
        multi.hset(`room:${roomId}:players:${playerId}`, player);
        await multi.exec();
    }

    async removePlayerFromRoom(roomId: string, playerId: string) {
        const multi = this.redisService.multi();
        multi.lrem(`room:${roomId}:players`, 0, playerId);
        multi.del(`room:${roomId}:players:${playerId}`);
        await multi.exec();
    }
}