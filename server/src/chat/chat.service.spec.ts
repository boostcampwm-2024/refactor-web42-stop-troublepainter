import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { ChatRepository } from './chat.repository';
import { describe } from 'node:test';
import { BadRequestException, PlayerNotFoundException } from '../exceptions/game.exception';
import { Player } from '../common/types/game.types';
import { PlayerRole, PlayerStatus } from '../common/enums/game.status.enum';

describe('ChatService', () => {
  let chatService: ChatService;

  const mockChatRepository = {
    getPlayer: jest.fn(),
    existsRoom: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatService, { provide: ChatRepository, useValue: mockChatRepository }],
    }).compile();

    chatService = module.get(ChatService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendMessage 테스트', async () => {
    it('메시지가 공백일 때', async () => {
      await expect(async () => {
        await chatService.sendMessage('room1', 'player1', '');
      }).rejects.toThrowError(BadRequestException);
    });

    it('플레이어가 존재하지 않을 때', async () => {
      mockChatRepository.getPlayer.mockResolvedValue(null);

      await expect(async () => {
        await chatService.sendMessage('room1', 'player1', 'hello world');
      }).rejects.toThrowError(PlayerNotFoundException);

      // 에러 캐치로 인해 순서를 바꿔서 배치
      expect(mockChatRepository.getPlayer).toHaveBeenCalled();
    });

    it('플레이어가 정상적으로 존재할 때', async () => {
      const player: Player = {
        playerId: 'player1',
        role: PlayerRole.GUESSER,
        status: PlayerStatus.PLAYING,
        nickname: 'player',
        profileImage: null,
        score: 10,
      };
      mockChatRepository.getPlayer.mockResolvedValue(player);

      const result = await chatService.sendMessage('room1', 'player1', 'hello world');

      // TODO : 타입 narrowing 필요
      expect(result).toBeDefined();
      expect(mockChatRepository.getPlayer).toHaveBeenCalled();
    });
  });
});
