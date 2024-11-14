import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
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

    async setJson(key: string, value: any): Promise<void> {
        await this.redis.set(key, JSON.stringify(value));
    }

    async getJson(key: string): Promise<any> {
        const value = await this.redis.get(key);
        return value ? JSON.parse(value) : null;
    }

    async del(key: string): Promise<void> {
        await this.redis.del(key);
    }

    async keys(pattern: string): Promise<string[]> {
        const keys: string[] = [];
        let cursor = '0';
    
        do {
            const reply = await this.redis.scan(cursor, 'MATCH', pattern, 'COUNT', '100');
            cursor = reply[0];
            keys.push(...reply[1]);
        } while (cursor !== '0');
    
        return keys;
    }
}
