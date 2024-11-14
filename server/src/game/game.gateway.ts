import { Injectable } from '@nestjs/common';
import { OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DrawingData } from './game.interface';
import { RoomService } from '../room/room.service';

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
@Injectable()
export class GameGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly roomService: RoomService) {}

  @SubscribeMessage('createRoom')
  async handleCreateRoom(client: Socket) {
    const result = await this.roomService.createRoom(client.id);
        
    if (result.success && result.data) {
      client.join(result.data.roomId);
      this.server.to(result.data.roomId).emit('roomCreated', result.data);
      return result;
    }

    client.emit('error', { message: result.error });
    return result;
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: Socket, roomId: string) {
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

  @SubscribeMessage('draw')
  async handleDraw(client: Socket, data: DrawingData
  ) {
    const room = await this.roomService.getRoom(data.roomId);
        
    if (!room || !room.players.includes(client.id)) {
      return { success: false, error: 'Not authorized' };
    }

    client.to(data.roomId).emit('drawUpdate', data.data);
    return { success: true };
  }

  async handleDisconnect(client: Socket) {
    try {
      const rooms = await this.roomService.findRoomsByPlayerId(client.id);
      
      for (const room of rooms) {
        const result = await this.roomService.leaveRoom(room.roomId, client.id);
        
        if (result.success && result.data && !result.data.isDeleted) {
          this.server.to(room.roomId).emit('playerLeft', {
            playerId: client.id,
            room: result.data.room
          });
        }
      }
    } catch (error) {
      console.error('Disconnect handling error:', error);
    }
  }
}
