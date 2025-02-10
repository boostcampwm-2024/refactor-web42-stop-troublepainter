import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redis: Redis;
  private publisher: Redis;
  private subscriber: Redis;

  constructor(private configService: ConfigService) {
    const redisConfig = {
      host: this.configService.get<string>('REDIS_HOST'),
      port: parseInt(this.configService.get<string>('REDIS_PORT'), 10),
    };

    this.redis = new Redis(redisConfig);
    this.publisher = new Redis(redisConfig);
    this.subscriber = new Redis(redisConfig);
  }

  async hset(key: string, value: Record<string, any>): Promise<void> {
    await this.redis.hset(key, value);
  }

  async hget(key: string, field: string): Promise<any> {
    const value = await this.redis.hget(key, field);
    return value;
  }

  async hgetall(key: string) {
    const value = await this.redis.hgetall(key);
    return Object.keys(value).length > 0 ? value : null;
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

  async exists(key: string): Promise<number> {
    return await this.redis.exists(key);
  }

  multi() {
    return this.redis.multi();
  }

  async publish(channel: string, message: string) {
    await this.publisher.publish(channel, message);
  }

  async subscribe(channel: string, callback: (message: string) => void) {
    await this.subscriber.subscribe(channel);
    this.subscriber.on('message', (ch, message) => {
      if (ch === channel) {
        callback(message);
      }
    });
  }

  async unsubscribe(channel: string) {
    await this.subscriber.unsubscribe(channel);
  }

  async psubscribe(pattern: string, callback: (channel: string, message: string) => void) {
    await this.subscriber.psubscribe(pattern);
    this.subscriber.on('pmessage', (pattern, channel, message) => {
      callback(channel, message);
    });
  }

  async punsubscribe(pattern: string) {
    await this.subscriber.punsubscribe(pattern);
  }

  // 원활한 테스트 진행을 위해 redis 내 저장된 값을 지워주는 코드 추가
  async flushAll() {
    await this.redis.flushall();
  }

  quit() {
    this.redis.quit();
  }
}
