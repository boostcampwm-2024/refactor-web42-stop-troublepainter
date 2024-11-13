import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';
import { ConfigModule } from '@nestjs/config';

describe('RedisService', () => {
  let service: RedisService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [RedisService],
    }).compile();

    service = module.get<RedisService>(RedisService);
  });

  afterAll(async () => {
    await service.onModuleDestroy();
  });

  it('should connect to Redis and respond to PING', async () => {
    const client = service.getClient();
    const response = await client.ping();
    expect(response).toBe('PONG');
  });
});
