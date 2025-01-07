import { Test, TestingModule } from '@nestjs/testing';
import { DrawingGateway } from './drawing.gateway';
import { DrawingService } from './drawing.service';
import { BadRequestException, PlayerNotFoundException, RoomNotFoundException } from '../exceptions/game.exception';
import { Socket } from 'socket.io';

describe('DrawingGateway 단위 테스트', () => {
  let gateway: DrawingGateway;
  let service: DrawingService;
  let client: Socket;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DrawingGateway,
        {
          provide: DrawingService,
          useValue: {
            existsRoom: jest.fn(),
            existsPlayer: jest.fn(),
          },
        },
      ],
    }).compile();

    gateway = module.get<DrawingGateway>(DrawingGateway);
    service = module.get<DrawingService>(DrawingService);
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
      client.handshake.auth = { roomId: 'room1', playerId: 'player1' };
      jest.spyOn(service, 'existsRoom').mockResolvedValue(false);
      jest.spyOn(service, 'existsPlayer').mockResolvedValue(true);

      await expect(gateway.handleConnection(client)).rejects.toThrowError(new RoomNotFoundException('Room not found'));
    });

    it('player가 redis 내에 존재하지 않는 경우', async () => {
      client.handshake.auth = { roomId: 'room1', playerId: 'player1' };
      jest.spyOn(service, 'existsRoom').mockResolvedValue(true);
      jest.spyOn(service, 'existsPlayer').mockResolvedValue(false);

      await expect(gateway.handleConnection(client)).rejects.toThrowError(
        new PlayerNotFoundException('Player not found in room'),
      );
    });

    it('room과 player가 정상적으로 존재하는 경우', async () => {
      client.handshake.auth = { roomId: 'room1', playerId: 'player1' };
      jest.spyOn(service, 'existsRoom').mockResolvedValue(true);
      jest.spyOn(service, 'existsPlayer').mockResolvedValue(true);

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

    it('should emit drawUpdated event to the room', async () => {
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
