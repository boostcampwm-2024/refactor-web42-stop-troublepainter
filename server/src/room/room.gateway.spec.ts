import { Test, TestingModule } from '@nestjs/testing';
import { RoomGateway } from './room.gateway';
import { RoomService } from './room.service';
import { Socket } from 'socket.io';

describe('RoomGateway', () => {
 let gateway: RoomGateway;
 let roomService: jest.Mocked<RoomService>;

 const mockServer = {
   to: jest.fn().mockReturnThis(),
   emit: jest.fn(),
 };

 const mockClient = {
   id: 'test-client-id',
   join: jest.fn(),
   leave: jest.fn(),
   emit: jest.fn(),
 };

 beforeEach(async () => {
   const mockRoomService = {
     createRoom: jest.fn(),
     joinRoom: jest.fn(),
     leaveRoom: jest.fn(),
   };

   const module: TestingModule = await Test.createTestingModule({
     providers: [
       RoomGateway,
       {
         provide: RoomService,
         useValue: mockRoomService,
       },
     ],
   }).compile();

   gateway = module.get<RoomGateway>(RoomGateway);
   roomService = module.get(RoomService);

   (gateway as any).server = mockServer;
 });

 afterEach(() => {
   jest.clearAllMocks();
 });

 describe('handleCreate', () => {
   it('should create room and emit event on success', async () => {
     const mockRoom = {
       roomId: 'test-room-id',
       players: [mockClient.id],
       hostId: mockClient.id,
     };

     roomService.createRoom.mockResolvedValueOnce({
       success: true,
       data: mockRoom,
     });

     const result = await gateway.handleCreate(mockClient as unknown as Socket);

     expect(roomService.createRoom).toHaveBeenCalledWith(mockClient.id);
     expect(mockClient.join).toHaveBeenCalledWith(mockRoom.roomId);
     expect(mockServer.to).toHaveBeenCalledWith(mockRoom.roomId);
     expect(mockServer.emit).toHaveBeenCalledWith('roomCreated', mockRoom);
     expect(result).toEqual({
       success: true,
       data: mockRoom,
     });
   });

   it('should emit error on failure', async () => {
     const mockError = 'Failed to create room';
     const mockResult = {
       success: false,
       error: mockError,
     };

     roomService.createRoom.mockResolvedValueOnce(mockResult);

     const result = await gateway.handleCreate(mockClient as unknown as Socket);

     expect(mockClient.join).not.toHaveBeenCalled();
     expect(mockClient.emit).toHaveBeenCalledWith('error', { 
       message: mockError 
     });
     expect(result).toEqual(mockResult);
   });
 });

 describe('handleJoin', () => {
   const roomId = 'test-room-id';

   it('should join room and emit event on success', async () => {
     const mockRoom = {
       roomId,
       players: ['existing-player', mockClient.id],
       hostId: 'existing-player',
     };

     roomService.joinRoom.mockResolvedValueOnce({
       success: true,
       data: mockRoom,
     });

     const result = await gateway.handleJoin(mockClient as unknown as Socket, roomId);

     expect(roomService.joinRoom).toHaveBeenCalledWith(roomId, mockClient.id);
     expect(mockClient.join).toHaveBeenCalledWith(roomId);
     expect(mockServer.to).toHaveBeenCalledWith(roomId);
     expect(mockServer.emit).toHaveBeenCalledWith('playerJoined', {
       playerId: mockClient.id,
       room: mockRoom,
     });
     expect(result).toEqual({
       success: true,
       data: mockRoom,
     });
   });

   it('should emit error on failure', async () => {
     const mockError = 'Room not found';
     const mockResult = {
       success: false,
       error: mockError,
     };

     roomService.joinRoom.mockResolvedValueOnce(mockResult);

     const result = await gateway.handleJoin(mockClient as unknown as Socket, roomId);

     expect(mockClient.join).not.toHaveBeenCalled();
     expect(mockClient.emit).toHaveBeenCalledWith('error', { 
       message: mockError 
     });
     expect(result).toEqual(mockResult);
   });
 });

 describe('handleLeave', () => {
   const roomId = 'test-room-id';

   it('should leave room and emit event when room still exists', async () => {
     const mockRoom = {
       roomId,
       players: ['remaining-player'],
       hostId: 'remaining-player',
     };

     roomService.leaveRoom.mockResolvedValueOnce({
       success: true,
       data: {
         isDeleted: false,
         room: mockRoom,
       },
     });

     const result = await gateway.handleLeave(mockClient as unknown as Socket, roomId);

     expect(roomService.leaveRoom).toHaveBeenCalledWith(roomId, mockClient.id);
     expect(mockClient.leave).toHaveBeenCalledWith(roomId);
     expect(mockServer.to).toHaveBeenCalledWith(roomId);
     expect(mockServer.emit).toHaveBeenCalledWith('playerLeft', {
       playerId: mockClient.id,
       room: mockRoom,
     });
     expect(result).toEqual({
       success: true,
       data: {
         isDeleted: false,
         room: mockRoom,
       },
     });
   });

   it('should just leave room when room is deleted', async () => {
     const mockResult = {
       success: true,
       data: {
         isDeleted: true,
       },
     };

     roomService.leaveRoom.mockResolvedValueOnce(mockResult);

     const result = await gateway.handleLeave(mockClient as unknown as Socket, roomId);

     expect(mockClient.leave).toHaveBeenCalledWith(roomId);
     expect(mockServer.emit).not.toHaveBeenCalledWith('playerLeft');
     expect(result).toEqual(mockResult);
   });

   it('should emit error on failure', async () => {
     const mockError = 'Room not found';
     const mockResult = {
       success: false,
       error: mockError,
     };

     roomService.leaveRoom.mockResolvedValueOnce(mockResult);

     const result = await gateway.handleLeave(mockClient as unknown as Socket, roomId);

     expect(mockClient.leave).not.toHaveBeenCalled();
     expect(mockClient.emit).toHaveBeenCalledWith('error', { 
       message: mockError 
     });
     expect(result).toEqual(mockResult);
   });
 });
});
