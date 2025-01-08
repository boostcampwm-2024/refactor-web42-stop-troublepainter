import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { BadRequestException, PlayerNotFoundException, RoomNotFoundException } from 'src/exceptions/game.exception';
import { Socket } from 'socket.io';

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let mockSocket: Partial<Socket>;

  const mockChatService = {
    existsRoom: jest.fn(),
    existsPlayer: jest.fn(),
    sendMessage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatGateway, { provide: ChatService, useValue: mockChatService }],
    }).compile();

    gateway = module.get(ChatGateway);

    /**
     * as unknown as 를 이용해 타입을 먼저 unknown으로 바꾼 다음,
     * 원하는 타입에 type assertion을 한다.
     */
    mockSocket = {
      handshake: { auth: { roomId: 'room1', playerId: 'player1' } },
      data: {},
      join: jest.fn(),
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    } as unknown as Socket;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleConnection 테스트', () => {
    it('roomId가 null일 때 BadRequestException을 발생', () => {
      mockSocket.handshake.auth = { roomId: null };

      expect(() => gateway.handleConnection(mockSocket as Socket)).toThrow(BadRequestException);
    });

    it('playerId가 null일 때 BadRequestException을 발생', () => {
      mockSocket.handshake.auth = { playerId: null };

      expect(() => gateway.handleConnection(mockSocket as Socket)).toThrow(BadRequestException);
    });

    it('room이 존재하지 않을 때 RoomNotFoundException을 발생', () => {
      mockChatService.existsRoom.mockReturnValue(false);

      expect(() => gateway.handleConnection(mockSocket as Socket)).toThrow(RoomNotFoundException);
      expect(mockChatService.existsRoom).toHaveBeenCalled();
    });

    it('플레이어가 룸에 존재하지 않을 때 PlayerNotFoundException을 발생', () => {
      mockChatService.existsRoom.mockReturnValue(true);
      mockChatService.existsPlayer.mockReturnValue(false);

      expect(() => gateway.handleConnection(mockSocket as Socket)).toThrow(PlayerNotFoundException);
      expect(mockChatService.existsPlayer).toHaveBeenCalled();
    });

    it('플레이어와 방이 정상적으로 할당되어 있을 때', () => {
      mockChatService.existsRoom.mockReturnValue(true);
      mockChatService.existsPlayer.mockReturnValue(true);

      gateway.handleConnection(mockSocket as Socket);

      expect(mockSocket.join).toHaveBeenCalled();
      expect(mockSocket.data).toEqual({ roomId: 'room1', playerId: 'player1' });
    });
  });

  describe('handleSendMessage 테스트', () => {
    it('데이터가 없을 때 BadRequestException을 발생', async () => {
      mockSocket.data = {};

      await expect(gateway.handleSendMessage(mockSocket as Socket, { message: 'hello world' })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('정상적으로 메시지를 발신할 수 있을 때', async () => {
      mockSocket.data = { roomId: 'room1', playerId: 'player1' };
      mockChatService.sendMessage.mockResolvedValue({ message: 'hello world', sender: 'player1' });

      await gateway.handleSendMessage(mockSocket as Socket, { message: 'hello world' });

      expect(mockChatService.sendMessage).toHaveBeenCalled();
      expect(mockSocket.to('room1').emit).toHaveBeenCalled();
    });
  });
});
