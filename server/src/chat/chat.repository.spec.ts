import { ChatRepository } from './chat.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from '../redis/redis.service';
import { describe } from 'node:test';
import { PlayerRole } from '../common/enums/game.status.enum';

describe('chat repository tests', () => {
  let chatRepository: ChatRepository;

  const mockRedisService = {
    hgetall: jest.fn(),
    exists: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatRepository,
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
      ],
    }).compile();

    chatRepository = module.get(ChatRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPlayer 테스트', () => {
    it('플레이어 데이터가 없을 때 null을 리턴', async () => {
      mockRedisService.hgetall.mockResolvedValue(null);

      const result = await chatRepository.getPlayer('room1', 'player1');
      expect(mockRedisService.hgetall).toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('플레이어 데이터가 있을 때 Player로 데이터를 변환해 리턴', async () => {
      const player = {
        role: PlayerRole.GUESSER,
        userImg: '',
        score: 15,
      };

      mockRedisService.hgetall.mockResolvedValue(player);

      const result = await chatRepository.getPlayer('room1', 'player1');
      expect(result).toEqual({
        ...player,
        profileImage: null,
      });
    });
  });

  describe('existsRoom 테스트', () => {
    it('방이 존재하지 않을 때 false를 리턴', async () => {
      mockRedisService.exists.mockResolvedValue(0);

      const result = await chatRepository.existsRoom('room1');
      expect(mockRedisService.exists).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  it('방이 존재할 때 true를 리턴', async () => {
    mockRedisService.exists.mockResolvedValue(1);

    const result = await chatRepository.existsRoom('room1');
    expect(mockRedisService.exists).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  describe('existsPlayer 테스트', () => {
    it('플레이어가 존재하지 않을 때 false를 리턴', async () => {
      mockRedisService.exists.mockResolvedValue(0);

      const result = await chatRepository.existsPlayer('room1', 'player1');
      expect(mockRedisService.exists).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('플레이어가 존재할 때 true를 리턴한다', async () => {
      mockRedisService.exists.mockResolvedValue(1);

      const result = await chatRepository.existsPlayer('room1', 'player1');
      expect(mockRedisService.exists).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });
});
