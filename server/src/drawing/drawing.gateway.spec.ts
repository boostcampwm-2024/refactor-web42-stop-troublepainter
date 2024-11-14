import { Test, TestingModule } from '@nestjs/testing';
import { DrawingGateway } from './drawing.gateway';
import { RoomService } from '../room/room.service';
import { Socket } from 'socket.io';

describe('DrawingGateway', () => {
  let gateway: DrawingGateway;
  let roomService: jest.Mocked<RoomService>;

  const mockServer = {
    to: jest.fn().mockReturnThis(),
    emit: jest.fn(),
  };

  const mockClient = {
    id: 'test-client-id',
    to: jest.fn().mockReturnThis(),
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const mockRoomService = {
      getRoom: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DrawingGateway,
        {
          provide: RoomService,
          useValue: mockRoomService,
        },
      ],
    }).compile();

    gateway = module.get<DrawingGateway>(DrawingGateway);
    roomService = module.get(RoomService);

    (gateway as any).server = mockServer;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleDraw', () => {
    const roomId = 'test-room-id';
    const drawingData = 'test-drawing-data';

    it('should emit drawing update to room members when authorized', async () => {
      const mockRoom = {
        roomId,
        players: [mockClient.id],
        hostId: mockClient.id,
      };

      roomService.getRoom.mockResolvedValueOnce(mockRoom);

      const result = await gateway.handleDraw(
        mockClient as unknown as Socket,
        { roomId, data: drawingData }
      );

      expect(roomService.getRoom).toHaveBeenCalledWith(roomId);
      expect(mockClient.to).toHaveBeenCalledWith(roomId);
      expect(mockClient.emit).toHaveBeenCalledWith('drawUpdate', drawingData);
      expect(result).toEqual({ success: true });
    });

    it('should reject if user is not in room', async () => {
      const mockRoom = {
        roomId,
        players: ['other-user'],
        hostId: 'other-user',
      };

      roomService.getRoom.mockResolvedValueOnce(mockRoom);

      const result = await gateway.handleDraw(
        mockClient as unknown as Socket,
        { roomId, data: drawingData }
      );

      expect(result).toEqual({ 
        success: false, 
        error: 'Not authorized' 
      });
      expect(mockClient.to).not.toHaveBeenCalled();
      expect(mockClient.emit).not.toHaveBeenCalled();
    });

    it('should reject if room does not exist', async () => {
      roomService.getRoom.mockResolvedValueOnce(null);

      const result = await gateway.handleDraw(
        mockClient as unknown as Socket,
        { roomId, data: drawingData }
      );

      expect(result).toEqual({ 
        success: false, 
        error: 'Not authorized' 
      });
      expect(mockClient.to).not.toHaveBeenCalled();
      expect(mockClient.emit).not.toHaveBeenCalled();
    });
  });
});