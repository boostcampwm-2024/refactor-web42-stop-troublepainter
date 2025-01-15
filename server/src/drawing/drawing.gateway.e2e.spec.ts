import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';
import { RedisService } from '../redis/redis.service';
import { DrawingGateway } from './drawing.gateway';
import { DrawingService } from './drawing.service';
import { DrawingRepository } from './drawing.repository';

describe('DrawingGateway e2e 테스트', () => {
  let app: INestApplication;
  let redisService: RedisService;
  let clientA: Socket;

  const URL = 'http://localhost:3001/socket.io/drawing';

  const mockConfigService = {
    provide: ConfigService,
    useValue: {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'REDIS_HOST') return 'localhost';
        if (key === 'REDIS_PORT') return '6379';
        return null;
      }),
    },
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DrawingGateway, DrawingService, DrawingRepository, RedisService, mockConfigService],
    }).compile();

    app = module.createNestApplication();
    redisService = module.get<RedisService>(RedisService);

    // 테스트용 서버 실행
    await app.listen(3001);
  });

  beforeEach(async () => {
    await redisService.hset('room:room1', { roomId: 'room1' });
    await redisService.hset('room:room1:player:player1', { playerId: 'player1' });

    clientA = io(URL, {
      auth: {
        roomId: 'room1',
        playerId: 'player1',
      },
    });

    await new Promise<void>((resolve) => {
      clientA.on('connect', resolve);
    });
  });

  afterEach(async () => {
    clientA.close();
    await redisService.flushAll();
  });

  afterAll(async () => {
    await app.close();
    redisService.quit();
  });

  describe('handleConnection', () => {
    it('roomId 또는 playerId의 값이 존재하지 않는 경우 "Room ID and Player ID are required" 에러가 발생한다.', async () => {
      const authInfo = [
        { roomId: '', playerId: '' },
        { roomId: 'room1', playerId: '' },
        { roomId: '', playerId: 'player1' },
      ];

      for (const auth of authInfo) {
        const socket = io(URL, {
          auth,
        });

        await new Promise<void>((resolve) => {
          socket.on('error', (e) => {
            expect(e.code).toBe(4000);
            expect(e.message).toBe('Room ID and Player ID are required');
            resolve();
          });
        });

        socket.close();
      }
    });

    it('room이 redis 내에 존재하지 않는 경우 "Room not found" 에러가 발생한다.', async () => {
      const invalidRoomClient = io(URL, {
        auth: {
          roomId: 'failed-room',
          playerId: 'player1',
        },
      });

      await new Promise<void>((resolve) => {
        invalidRoomClient.on('error', (e) => {
          expect(e.code).toBe(6005);
          expect(e.message).toBe('Room not found');
          resolve();
        });
      });

      invalidRoomClient.close();
    });

    it('player가 redis 내에 존재하지 않는 경우 "Player not found in room" 에러가 발생한다.', async () => {
      const invalidPlayerClient = io(URL, {
        auth: {
          roomId: 'room1',
          playerId: 'failed-player',
        },
      });

      await new Promise<void>((resolve) => {
        invalidPlayerClient.on('error', (e) => {
          expect(e.code).toBe(6006);
          expect(e.message).toBe('Player not found in room');
          resolve();
        });
      });

      invalidPlayerClient.close();
    });

    it('room과 player가 정상적으로 존재하는 경우 정상적으로 연결된다.', async () => {
      expect(clientA.connected).toBe(true);
    });
  });

  describe('handleDraw', () => {
    it('roomId 값이 존재하지 않는 경우 "Room ID is required" 에러가 발생한다.', async () => {
      const invalidRoomClient = io(URL, {
        auth: {
          roomId: 'failed-room',
          playerId: 'player1',
        },
      });

      invalidRoomClient.on('connect_error', (e) => {
        expect(e.message).toBe('Room ID is required');
        invalidRoomClient.close();
      });
    });

    it('정상적으로 그림이 그려지는 경우', async () => {
      const drawingData = {
        pos: 56,
        fillColor: { R: 0, G: 0, B: 0, A: 0 },
      };

      /**
       * client.to(roomId).emit('drawUpdated') 이므로
       * 그림 그린 사람을 제외하고 다른 사람이 존재해야 이벤트를 제대로 수신받는지 확인이 가능함
       * 이를 위해 clientB를 생성
       */
      await redisService.hset('room:room1:player:player2', { playerId: 'player2' });

      const clientB = io(URL, {
        auth: {
          roomId: 'room1',
          playerId: 'player2',
        },
      });

      // clientB가 연결이 완료될 때까지 기다림
      await new Promise<void>((resolve) => {
        clientB.on('connect', resolve);
      });

      // drawUpdated 이벤트 수신을 위한 Promise 생성
      const drawUpdatePromise = new Promise<void>((resolve) => {
        clientB.on('drawUpdated', (data) => {
          expect(data).toEqual({
            playerId: 'player1',
            drawingData: drawingData,
          });
          resolve();
        });
      });

      // clientA가 실제로 이벤트를 발생시킴
      clientA.emit('draw', { drawingData });

      await drawUpdatePromise;
      clientB.close();
    });
  });
});
