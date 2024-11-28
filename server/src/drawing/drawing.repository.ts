import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class DrawingRepository {
  constructor(private readonly redisService: RedisService) {}

  async existsRoom(roomId: string) {
    const exists = await this.redisService.exists(`room:${roomId}`);
    return exists === 1;
  }

  async existsPlayer(roomId: string, playerId: string) {
    const exists = await this.redisService.exists(`room:${roomId}:player:${playerId}`);
    return exists === 1;
  }
}
