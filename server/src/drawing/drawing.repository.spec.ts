import { Test, TestingModule } from '@nestjs/testing';
import { DrawingRepository } from './drawing.repository';
import { RedisService } from '../redis/redis.service';

describe('DrawingRepository 단위 테스트', () => {
  let repository: DrawingRepository;
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DrawingRepository,
        {
          provide: RedisService,
          useValue: {
            exists: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<DrawingRepository>(DrawingRepository);
    redisService = module.get<RedisService>(RedisService);
  });

  describe('existsRoom', () => {
    it('room이 존재한다면 true 반환', async () => {
      jest.spyOn(redisService, 'exists').mockResolvedValue(1);

      const exists = await repository.existsRoom('success');

      expect(exists).toBe(true);
      expect(redisService.exists).toHaveBeenCalledWith('room:success');
    });

    it('room이 존재하지 않는다면 false 반환', async () => {
      jest.spyOn(redisService, 'exists').mockResolvedValue(0);

      const exists = await repository.existsRoom('failed');

      expect(exists).toBe(false);
    });
  });

  describe('existsPlayer', () => {
    it('player가 존재한다면 true 반환', async () => {
      jest.spyOn(redisService, 'exists').mockResolvedValue(1);

      const exists = await repository.existsPlayer('success', 'player');

      expect(exists).toBe(true);
      expect(redisService.exists).toHaveBeenCalledWith('room:success:player:player');
    });

    it('player가 존재하지 않는다면 false 반환', async () => {
      jest.spyOn(redisService, 'exists').mockResolvedValue(0);

      const exists = await repository.existsPlayer('failed', 'non');

      expect(exists).toBe(false);
    });
  });
});
