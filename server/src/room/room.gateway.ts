import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { RoomService } from './room.service';

@WebSocketGateway({
  cors: {
      origin: '*'
  },
  namespace: 'room'
})
@Injectable()
export class RoomGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly roomService: RoomService) {}

  @SubscribeMessage('create')
  async handleCreate(@ConnectedSocket() client: Socket) {
    const result = await this.roomService.createRoom(client.id);
        
    if (result.success && result.data) {
      client.join(result.data.roomId);
      this.server.to(result.data.roomId).emit('roomCreated', result.data);
      return result;
    }

    client.emit('error', { message: result.error });
    return result;
  }

  @SubscribeMessage('join')
  async handleJoin(@ConnectedSocket() client: Socket, roomId: string) {
    const result = await this.roomService.joinRoom(roomId, client.id);

    if (result.success && result.data) {
      client.join(roomId);
      this.server.to(roomId).emit('playerJoined', {
        playerId: client.id,
        room: result.data
      });
      return result;
    }

    client.emit('error', { message: result.error });
    return result;
  }

  @SubscribeMessage('leave')
  async handleLeave(@ConnectedSocket() client: Socket, roomId: string) {
    const result = await this.roomService.leaveRoom(roomId, client.id);
      if (result.success) {
        client.leave(roomId);
        if (result.data && !result.data.isDeleted) {
          this.server.to(roomId).emit('playerLeft', {
            playerId: client.id,
            room: result.data.room
          });
        }
        return result;
      }

    client.emit('error', { message: result.error });
    return result;
  }
}
