import { Test, TestingModule } from '@nestjs/testing';
import { DrawingRepository } from './drawing.repository';
import { DrawingService } from './drawing.service';

describe('DrawingService 단위 테스트', () => {
  let repository: DrawingRepository;
  let service: DrawingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DrawingService,
        {
          provide: DrawingRepository,
          useValue: {
            existsRoom: jest.fn(),
            existsPlayer: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<DrawingRepository>(DrawingRepository);
    service = module.get<DrawingService>(DrawingService);
  });

  describe('existsRoom', () => {
    it('room이 존재한다면 true 반환', async () => {
      jest.spyOn(repository, 'existsRoom').mockResolvedValue(true);

      const exists = await service.existsRoom('success');

      expect(exists).toBe(true);
    });

    it('room이 존재하지 않는다면 false 반환', async () => {
      jest.spyOn(repository, 'existsRoom').mockResolvedValue(false);

      const exists = await service.existsRoom('failed');

      expect(exists).toBe(false);
    });
  });

  describe('existsPlayer', () => {
    it('player가 존재한다면 true 반환', async () => {
      jest.spyOn(repository, 'existsPlayer').mockResolvedValue(true);

      const exists = await service.existsPlayer('success', 'player');

      expect(exists).toBe(true);
    });

    it('player가 존재하지 않는다면 false 반환', async () => {
      jest.spyOn(repository, 'existsPlayer').mockResolvedValue(false);

      const exists = await service.existsPlayer('failed', 'non');

      expect(exists).toBe(false);
    });
  });
});
