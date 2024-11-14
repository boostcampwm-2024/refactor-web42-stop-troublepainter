import { Test, TestingModule } from '@nestjs/testing';
import { RoomService } from './room.service';
import { RedisService } from '../redis/redis.service';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-room-id')
}));

describe('RoomService', () => {
  let roomService: RoomService;
  let redisService: jest.Mocked<RedisService>;

  beforeEach(async () => {
    const mockRedisService = {
      set: jest.fn(),
      get: jest.fn(),
      del: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomService,
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
      ],
    }).compile();

    roomService = module.get<RoomService>(RoomService);
    redisService = module.get(RedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createRoom', () => {
    it('should successfully create a room', async () => {
      const hostId = 'test-host-id';
      const expectedRoom = {
        roomId: 'test-room-id',
        players: [hostId],
        hostId,
      };

      redisService.set.mockResolvedValueOnce(undefined);

      const result = await roomService.createRoom(hostId);

      expect(result).toEqual({
        success: true,
        data: expectedRoom,
      });
      expect(redisService.set).toHaveBeenCalledWith(
        'room:test-room-id',
        expectedRoom
      );
    });

    it('should handle errors when creating room', async () => {
      const hostId = 'test-host-id';
      const error = new Error('Redis error');

      redisService.set.mockRejectedValueOnce(error);

      const result = await roomService.createRoom(hostId);

      expect(result).toEqual({
        success: false,
        error: 'Redis error',
      });
    });
  });

  describe('joinRoom', () => {
    it('should successfully join a room', async () => {
      const roomId = 'test-room-id';
      const playerId = 'test-player-id';
      const existingRoom = {
        roomId,
        players: ['host-id'],
        hostId: 'host-id',
      };
      const expectedRoom = {
        ...existingRoom,
        players: [...existingRoom.players, playerId],
      };

      redisService.get.mockResolvedValueOnce(existingRoom);
      redisService.set.mockResolvedValueOnce(undefined);

      const result = await roomService.joinRoom(roomId, playerId);

      expect(result).toEqual({
        success: true,
        data: expectedRoom,
      });
      expect(redisService.set).toHaveBeenCalledWith(
        'room:test-room-id',
        expectedRoom
      );
    });

    it('should fail if room does not exist', async () => {
      redisService.get.mockResolvedValueOnce(null);

      const result = await roomService.joinRoom('non-existent-room', 'player-id');

      expect(result).toEqual({
        success: false,
        error: 'Room not found',
      });
      expect(redisService.set).not.toHaveBeenCalled();
    });

    it('should fail if player is already in room', async () => {
      const roomId = 'test-room-id';
      const playerId = 'test-player-id';
      const existingRoom = {
        roomId,
        players: [playerId],
        hostId: 'host-id',
      };

      redisService.get.mockResolvedValueOnce(existingRoom);

      const result = await roomService.joinRoom(roomId, playerId);

      expect(result).toEqual({
        success: false,
        error: 'Player already in room',
      });
      expect(redisService.set).not.toHaveBeenCalled();
    });
  });

  describe('leaveRoom', () => {
    it('should successfully leave a room and delete if empty', async () => {
      const roomId = 'test-room-id';
      const playerId = 'test-player-id';
      const existingRoom = {
        roomId,
        players: [playerId],
        hostId: playerId,
      };

      redisService.get.mockResolvedValueOnce(existingRoom);
      redisService.del.mockResolvedValueOnce(undefined);

      const result = await roomService.leaveRoom(roomId, playerId);

      expect(result).toEqual({
        success: true,
        data: { isDeleted: true },
      });
      expect(redisService.del).toHaveBeenCalledWith('room:test-room-id');
    });

    it('should successfully leave a room and update host if needed', async () => {
      const roomId = 'test-room-id';
      const hostId = 'host-id';
      const remainingPlayer = 'remaining-player';
      const existingRoom = {
        roomId,
        players: [hostId, remainingPlayer],
        hostId,
      };
      const expectedRoom = {
        roomId,
        players: [remainingPlayer],
        hostId: remainingPlayer,
      };

      redisService.get.mockResolvedValueOnce(existingRoom);
      redisService.set.mockResolvedValueOnce(undefined);

      const result = await roomService.leaveRoom(roomId, hostId);

      expect(result).toEqual({
        success: true,
        data: { isDeleted: false, room: expectedRoom },
      });
      expect(redisService.set).toHaveBeenCalledWith(
        'room:test-room-id',
        expectedRoom
      );
    });

    it('should fail if room does not exist', async () => {
      redisService.get.mockResolvedValueOnce(null);

      const result = await roomService.leaveRoom('non-existent-room', 'player-id');

      expect(result).toEqual({
        success: false,
        error: 'Room not found',
      });
      expect(redisService.set).not.toHaveBeenCalled();
      expect(redisService.del).not.toHaveBeenCalled();
    });
  });

  describe('getRoom', () => {
    it('should successfully get a room', async () => {
      const roomId = 'test-room-id';
      const room = {
        roomId,
        players: ['player-id'],
        hostId: 'host-id',
      };

      redisService.get.mockResolvedValueOnce(room);

      const result = await roomService.getRoom(roomId);

      expect(result).toEqual(room);
    });

    it('should return null for non-existent room', async () => {
      redisService.get.mockResolvedValueOnce(null);

      const result = await roomService.getRoom('non-existent-room');

      expect(result).toBeNull();
    });
  });
});