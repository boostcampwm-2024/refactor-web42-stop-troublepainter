import { ChatRepository } from './chat.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from '../redis/redis.service';
import { describe } from 'node:test';
import { PlayerRole } from '../common/enums/game.status.enum';

describe('ChatRepository', () => {
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

    it('플레이어 데이터 중 role이 없을 때 null을 리턴', async () => {
      const player = {
        role: '',
        userImg: 'test',
        score: 15,
      };

      mockRedisService.hgetall.mockResolvedValue(player);

      const result = await chatRepository.getPlayer('room1', 'player1');
      expect(result).toEqual({
        ...player,
        role: null,
        profileImage: player.userImg,
      });
    });

    it('플레이어 데이터 중 이미지가 없을 때 profileImage가 null을 리턴', async () => {
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

    it('플레이어 데이터 중 이미지가 있을 때 profileImage가 userImg와 동일하게 리턴', async () => {
      const player = {
        role: PlayerRole.GUESSER,
        userImg: 'test',
        score: 15,
      };

      mockRedisService.hgetall.mockResolvedValue(player);

      const result = await chatRepository.getPlayer('room1', 'player1');
      expect(result).toEqual({
        ...player,
        profileImage: player.userImg,
      });
    });

    it('플레이어 데이터에서 score 임계값을 처리', async () => {
      const testCases = [
        { inputScore: '15', expectedScore: 15 },
        { inputScore: '-5', expectedScore: -5 },
        { inputScore: '', expectedScore: 0 },
        { inputScore: null, expectedScore: 0 },
        { inputScore: 'abc', expectedScore: 0 },
      ];

      for (const testCase of testCases) {
        const player = {
          role: PlayerRole.GUESSER,
          userImg: 'test',
          score: testCase.inputScore,
        };

        mockRedisService.hgetall.mockResolvedValue(player);

        const result = await chatRepository.getPlayer('room1', 'player1');
        expect(result).toEqual({
          ...player,
          profileImage: player.userImg,
          score: testCase.expectedScore,
        });
      }
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
