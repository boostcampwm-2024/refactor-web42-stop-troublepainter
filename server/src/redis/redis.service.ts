import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private redisClient: Redis;

    constructor(private configService: ConfigService) {
        this.redisClient = new Redis({
            host: this.configService.get<string>('REDIS_HOST'),
            port: parseInt(this.configService.get<string>('REDIS_PORT'), 10),
        });
    }

    async onModuleInit() {
        await this.redisClient.ping();
    }

    async onModuleDestroy() {
        await this.redisClient.quit();
    }

    getClient() {
        return this.redisClient;
    }
}
