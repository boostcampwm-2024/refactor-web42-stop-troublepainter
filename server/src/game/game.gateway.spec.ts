import { Test, TestingModule } from '@nestjs/testing';
import { GameGateway } from './game.gateway';
import { RoomService } from '../room/room.service';
import { Socket, Server } from 'socket.io';
import { DrawingData } from './game.interface';
import { Room } from '../room/room.interface';

describe('GameGateway', () => {
  let gateway: GameGateway;
  let roomService: RoomService;
  let mockServer: Partial<Server>;
  let mockClient: Partial<Socket>;

  beforeEach(async () => {
    const roomServiceMock = {
      createRoom: jest.fn(),
      joinRoom: jest.fn(),
      getRoom: jest.fn(),
      findRoomsByPlayerId: jest.fn(),
      leaveRoom: jest.fn(),
    };

    mockServer = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    };

    mockClient = {
      id: 'test-client-id',
      join: jest.fn(),
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameGateway,
        {
          provide: RoomService,
          useValue: roomServiceMock,
        },
      ],
    }).compile();

    gateway = module.get<GameGateway>(GameGateway);
    roomService = module.get<RoomService>(RoomService);
    gateway.server = mockServer as Server;
  });

  describe('handleCreateRoom', () => {
    it('should successfully create a room', async () => {
      const mockRoom: Room = {
        roomId: 'test-room',
        hostId: 'test-client-id',
        players: ['test-client-id']
      };
      const mockResult = { success: true, data: mockRoom };
      
      jest.spyOn(roomService, 'createRoom').mockResolvedValue(mockResult);

      const result = await gateway.handleCreateRoom(mockClient as Socket);

      expect(roomService.createRoom).toHaveBeenCalledWith(mockClient.id);
      expect(mockClient.join).toHaveBeenCalledWith(mockRoom.roomId);
      expect(mockServer.to).toHaveBeenCalledWith(mockRoom.roomId);
      expect(mockServer.emit).toHaveBeenCalledWith('roomCreated', mockRoom);
      expect(result).toBe(mockResult);
    });

    it('should handle room creation failure', async () => {
      const mockError = { success: false, error: 'Creation failed' };
      
      jest.spyOn(roomService, 'createRoom').mockResolvedValue(mockError);

      const result = await gateway.handleCreateRoom(mockClient as Socket);

      expect(mockClient.emit).toHaveBeenCalledWith('error', { message: mockError.error });
      expect(result).toBe(mockError);
    });
  });

  describe('handleJoinRoom', () => {
    it('should successfully join a room', async () => {
      const roomId = 'test-room';
      const mockRoom: Room = {
        roomId,
        hostId: 'host-id',
        players: ['test-client-id']
      };
      const mockResult = { success: true, data: mockRoom };

      jest.spyOn(roomService, 'joinRoom').mockResolvedValue(mockResult);

      const result = await gateway.handleJoinRoom(mockClient as Socket, roomId);

      expect(roomService.joinRoom).toHaveBeenCalledWith(roomId, mockClient.id);
      expect(mockClient.join).toHaveBeenCalledWith(roomId);
      expect(mockServer.to).toHaveBeenCalledWith(roomId);
      expect(mockServer.emit).toHaveBeenCalledWith('playerJoined', {
        playerId: mockClient.id,
        room: mockRoom
      });
      expect(result).toBe(mockResult);
    });

    it('should handle join room failure', async () => {
      const roomId = 'test-room';
      const mockError = { success: false, error: 'Join failed' };

      jest.spyOn(roomService, 'joinRoom').mockResolvedValue(mockError);

      const result = await gateway.handleJoinRoom(mockClient as Socket, roomId);

      expect(mockClient.emit).toHaveBeenCalledWith('error', { message: mockError.error });
      expect(result).toBe(mockError);
    });
  });

  describe('handleDraw', () => {
    it('should successfully handle drawing update', async () => {
      const drawingData: DrawingData = {
        roomId: 'test-room',
        data: { x: 100, y: 100 }
      };
      const mockRoom: Room = {
        roomId: 'test-room',
        hostId: 'host-id',
        players: ['test-client-id']
      };

      jest.spyOn(roomService, 'getRoom').mockResolvedValue(mockRoom);

      const result = await gateway.handleDraw(mockClient as Socket, drawingData);

      expect(roomService.getRoom).toHaveBeenCalledWith(drawingData.roomId);
      expect(mockClient.to).toHaveBeenCalledWith(drawingData.roomId);
      expect(mockClient.emit).toHaveBeenCalledWith('drawUpdate', drawingData.data);
      expect(result).toEqual({ success: true });
    });

    it('should handle unauthorized drawing attempt', async () => {
      const drawingData: DrawingData = {
        roomId: 'test-room',
        data: { x: 100, y: 100 }
      };
      const mockRoom: Room = {
        roomId: 'test-room',
        hostId: 'host-id',
        players: ['other-player-id']
      };

      jest.spyOn(roomService, 'getRoom').mockResolvedValue(mockRoom);

      const result = await gateway.handleDraw(mockClient as Socket, drawingData);

      expect(result).toEqual({ success: false, error: 'Not authorized' });
    });
  });

  describe('handleDisconnect', () => {
    it('should handle player disconnection', async () => {
      const mockRooms = [{ roomId: 'test-room', hostId: 'host-id', players: ['test-client-id'] }];
      const mockLeaveResult = {
        success: true,
        data: {
          isDeleted: false,
          room: {
            roomId: 'test-room',
            hostId: 'host-id',
            players: []
          }
        }
      };

      jest.spyOn(roomService, 'findRoomsByPlayerId').mockResolvedValue(mockRooms);
      jest.spyOn(roomService, 'leaveRoom').mockResolvedValue(mockLeaveResult);

      await gateway.handleDisconnect(mockClient as Socket);

      expect(roomService.findRoomsByPlayerId).toHaveBeenCalledWith(mockClient.id);
      expect(roomService.leaveRoom).toHaveBeenCalledWith('test-room', mockClient.id);
      expect(mockServer.to).toHaveBeenCalledWith('test-room');
      expect(mockServer.emit).toHaveBeenCalledWith('playerLeft', {
        playerId: mockClient.id,
        room: mockLeaveResult.data.room
      });
    });

    it('should handle errors during disconnection', async () => {
      const mockError = new Error('Disconnection error');
      jest.spyOn(roomService, 'findRoomsByPlayerId').mockRejectedValue(mockError);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await gateway.handleDisconnect(mockClient as Socket);

      expect(consoleSpy).toHaveBeenCalledWith('Disconnect handling error:', mockError);
      consoleSpy.mockRestore();
    });
  });
});