import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { Socket } from 'socket.io';
import { RedisService } from '../redis/redis.service';
import { DrawingGateway } from './drawing.gateway';
import { DrawingService } from './drawing.service';
import { DrawingRepository } from './drawing.repository';
import { BadRequestException, PlayerNotFoundException, RoomNotFoundException } from '../exceptions/game.exception';

describe('DrawingGateway 통합 테스트', () => {
  let gateway: DrawingGateway;
  let service: DrawingService;
  let redisService: RedisService;
  let client: Socket;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DrawingGateway,
        DrawingService,
        DrawingRepository,
        RedisService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'REDIS_HOST') return 'localhost';
              if (key === 'REDIS_PORT') return '6379';
              return null;
            }),
          },
        },
      ],
    }).compile();

    gateway = module.get<DrawingGateway>(DrawingGateway);
    service = module.get<DrawingService>(DrawingService);
    redisService = module.get<RedisService>(RedisService);
  });

  beforeEach(async () => {
    client = {
      handshake: {
        auth: { roomId: '', playerId: '' },
      },
      data: {},
      join: jest.fn(),
      to: jest.fn().mockReturnValue({
        emit: jest.fn(),
      }),
    } as any;

    await redisService.hset('room:room1', { roomId: 'room1' });
    await redisService.hset('room:room1:player:player1', { playerId: 'player1' });
  });

  // 테스트가 수행될 때마다 DB를 비워줌
  afterEach(async () => {
    await redisService.flushAll();
  });

  // 테스트가 종료되면 Redis를 종료
  afterAll(() => {
    redisService.quit();
  });

  describe('handleConnection', () => {
    it('roomId 또는 playerId의 값이 존재하지 않는 경우', async () => {
      const authInfo = [
        { roomId: '', playerId: '' },
        { roomId: 'room1', playerId: '' },
        { roomId: '', playerId: 'player1' },
      ];

      for (const auth of authInfo) {
        client.handshake.auth = auth;
        await expect(gateway.handleConnection(client)).rejects.toThrowError(
          new BadRequestException('Room ID and Player ID are required'),
        );
      }
    });

    it('room이 redis 내에 존재하지 않는 경우', async () => {
      client.handshake.auth = { roomId: 'failed-room', playerId: 'player1' };

      await expect(gateway.handleConnection(client)).rejects.toThrowError(new RoomNotFoundException('Room not found'));
    });

    it('player가 redis 내에 존재하지 않는 경우', async () => {
      client.handshake.auth = { roomId: 'room1', playerId: 'failed-player' };

      await expect(gateway.handleConnection(client)).rejects.toThrowError(
        new PlayerNotFoundException('Player not found in room'),
      );
    });

    it('room과 player가 정상적으로 존재하는 경우', async () => {
      client.handshake.auth = { roomId: 'room1', playerId: 'player1' };
      await gateway.handleConnection(client);

      expect(client.join).toHaveBeenCalledWith('room1');
      expect(client.data.roomId).toBe('room1');
      expect(client.data.playerId).toBe('player1');
    });
  });

  describe('handleDraw', () => {
    it('roomId 값이 존재하지 않는 경우', async () => {
      client.data = {};
      const data = { drawingData: {} };

      await expect(gateway.handleDraw(client, data)).rejects.toThrowError(
        new BadRequestException('Room ID is required'),
      );
    });

    it('정상적으로 그림이 그려지는 경우', async () => {
      client.data = { roomId: 'room1', playerId: 'player1' };
      const data = { drawingData: { pos: 56, fillColor: { R: 0, G: 0, B: 0, A: 0 } } };

      await gateway.handleDraw(client, data);

      expect(client.to).toHaveBeenCalledWith('room1');
      expect(client.to('room1').emit).toHaveBeenCalledWith('drawUpdated', {
        playerId: 'player1',
        drawingData: data.drawingData,
      });
    });
  });
});
