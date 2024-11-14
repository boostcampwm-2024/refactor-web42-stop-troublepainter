  import { Test, TestingModule } from '@nestjs/testing';
  import { RedisService } from './redis.service';
  import { ConfigModule } from '@nestjs/config';
  import Redis from 'ioredis';

  describe('RedisService', () => {
    let service: RedisService;
    let redis: Redis;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            isGlobal: true,
            load: [() => ({
              REDIS_HOST: 'localhost',
              REDIS_PORT: 6379,
            })],
          }),
        ],
        providers: [RedisService],
      }).compile();

      service = module.get<RedisService>(RedisService);
      redis = (service as any).redis;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    describe('set', () => {
      it('should successfully set a value', async () => {
        const key = 'test-key';
        const value = { test: 'data' };

        await service.setJson(key, value);
        const result = await redis.get(key);

        expect(JSON.parse(result)).toEqual(value);
      });

      it('should handle errors when setting value', async () => {
        const key = 'test-key';
        const value = { test: 'data' };

        jest.spyOn(redis, 'set').mockRejectedValueOnce(new Error('Redis error'));

        await expect(service.setJson(key, value)).rejects.toThrow('Redis error');
      });
    });

    describe('get', () => {
      it('should successfully get a value', async () => {
        const key = 'test-key';
        const value = { test: 'data' };

        await redis.set(key, JSON.stringify(value));
        const result = await service.getJson(key);

        expect(result).toEqual(value);
      });

      it('should return null for non-existent key', async () => {
        const result = await service.getJson('non-existent-key');
        expect(result).toBeNull();
      });

      it('should handle errors when getting value', async () => {
        jest.spyOn(redis, 'get').mockRejectedValueOnce(new Error('Redis error'));

        await expect(service.getJson('test-key')).rejects.toThrow('Redis error');
      });
    });

    describe('del', () => {
      it('should successfully delete a key', async () => {
        const key = 'test-key';
        const value = { test: 'data' };

        await redis.set(key, JSON.stringify(value));
        await service.del(key);

        const result = await redis.get(key);
        expect(result).toBeNull();
      });

      it('should handle errors when deleting key', async () => {
        jest.spyOn(redis, 'del').mockRejectedValueOnce(new Error('Redis error'));

        await expect(service.del('test-key')).rejects.toThrow('Redis error');
      });
    });
  });
