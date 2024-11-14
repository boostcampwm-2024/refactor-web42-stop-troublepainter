import { Injectable } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from '../room/room.service';
import { DrawingData } from './drawing.interface';

@WebSocketGateway({
  cors: {
    origin: '*'
  },
  namespace: 'drawing'
})
@Injectable()
export class DrawingGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly roomService: RoomService) {}

  @SubscribeMessage('draw')
  async handleDraw(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: DrawingData
  ) {
    const room = await this.roomService.getRoom(data.roomId);
        
    if (!room || !room.players.includes(client.id)) {
      return { success: false, error: 'Not authorized' };
    }

    client.to(data.roomId).emit('drawUpdate', data.data);
    return { success: true };
  }
}
