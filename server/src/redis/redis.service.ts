import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redis: Redis;

  constructor(private configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: parseInt(this.configService.get<string>('REDIS_PORT'), 10),
    });
  }

  async hset(key: string, value: Record<string, any>): Promise<void> {
    await this.redis.hset(key, value);
  }

  async hgetall(key: string) {
    const value = await this.redis.hgetall(key);
    return Object.keys(value).length > 0 ? value : null;
  }

  async hget(key: string, field: string): Promise<any> {
    const value = await this.redis.hget(key, field);
    return value;
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async lpush(key: string, value: string): Promise<void> {
    await this.redis.lpush(key, value);
  }

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    const values = await this.redis.lrange(key, start, stop);
    return values;
  }

  async lrangeAll(key: string): Promise<string[]> {
    return await this.lrange(key, 0, -1);
  }

  async lrem(key: string, count: number, value: string): Promise<void> {
    await this.redis.lrem(key, count, value);
  }

  multi() {
    return this.redis.multi();
  }
}
