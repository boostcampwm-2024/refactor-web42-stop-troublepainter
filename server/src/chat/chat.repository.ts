import { Injectable } from "@nestjs/common";
import { RedisService } from "src/redis/redis.service";
import { Player } from "src/common/types/game.types";

@Injectable()
export class ChatRepository {
    constructor(private readonly redisService: RedisService) {}

    async getPlayer(roomId: string, playerId: string) {
        const player = await this.redisService.hgetall(`room:${roomId}:players:${playerId}`);
        if (!player || Object.keys(player).length === 0) return null;
    
        return {
            ...player,
            role: player.role === '' ? null : player.role,
            profileImage: player.userImg === '' ? null : player.userImg,
            score: parseInt(player.score, 10) || 0,
        } as Player;
    }
}