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

    async hget(key: string, field?: string): Promise<any> {
        if (field) {
            const value = await this.redis.hget(key, field);
            return value;
        } else {
            const value = await this.redis.hgetall(key);
            return Object.keys(value).length > 0 ? value : null;
        }
    }

    async del(key: string): Promise<void> {
        await this.redis.del(key);
    }
}
