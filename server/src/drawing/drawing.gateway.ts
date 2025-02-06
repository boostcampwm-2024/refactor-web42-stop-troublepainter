import { UseFilters } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BadRequestException } from '../exceptions/game.exception';
import { WsExceptionFilter } from '../filters/ws-exception.filter';
import { DrawingService } from './drawing.service';
import { RedisService } from '../redis/redis.service';

@WebSocketGateway({
  cors: '*',
  namespace: '/socket.io/drawing',
})
@UseFilters(WsExceptionFilter)
export class DrawingGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly drawingService: DrawingService,
    private readonly redisService: RedisService,
  ) {}

  async handleConnection(client: Socket) {
    const roomId = client.handshake.auth.roomId;
    const playerId = client.handshake.auth.playerId;

    if (!roomId || !playerId) {
      client.emit('error', {
        code: 4000,
        message: 'Room ID and Player ID are required',
      });
      client.disconnect();
      return;
    }

    const roomExists = await this.drawingService.existsRoom(roomId);
    if (!roomExists) {
      client.emit('error', {
        code: 6005,
        message: 'Room not found',
      });
      client.disconnect();
      return;
    }
    const playerExists = await this.drawingService.existsPlayer(roomId, playerId);
    if (!playerExists) {
      client.emit('error', {
        code: 6006,
        message: 'Player not found in room',
      });
      client.disconnect();
      return;
    }

    client.data.roomId = roomId;
    client.data.playerId = playerId;

    client.join(roomId);
  }

  @SubscribeMessage('draw')
  async handleDraw(@ConnectedSocket() client: Socket, @MessageBody() data: { drawingData: any }) {
    const roomId = client.data.roomId;
    if (!roomId) throw new BadRequestException('Room ID is required');

    client.to(roomId).emit('drawUpdated', {
      playerId: client.data.playerId,
      drawingData: data.drawingData,
    });

    await this.redisService.publish(
      `drawing:${roomId}`,
      JSON.stringify({
        playerId: client.data.playerId,
        drawingData: data.drawingData,
      }),
    );
  }
}
