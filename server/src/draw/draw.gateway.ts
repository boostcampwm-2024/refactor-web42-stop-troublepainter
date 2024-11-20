import { UseFilters } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BadRequestException } from 'src/exceptions/game.exception';
import { WsExceptionFilter } from 'src/filters/ws-exception.filter';

@WebSocketGateway({
  cors: '*',
  namespace: 'draw',
})
@UseFilters(WsExceptionFilter)
export class DrawGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const roomId = client.handshake.auth.roomId;
    const playerId = client.handshake.auth.playerId;

    if (!roomId || !playerId) throw new BadRequestException('Room ID and Player ID are required');

    client.data.roomId = roomId;
    client.data.playerId = playerId;

    client.join(roomId);
  }
  
  @SubscribeMessage('draw')
  async handleDraw(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { drawingData: any },
  ) {
    const roomId = client.data.roomId;
    if (!roomId) throw new BadRequestException('Room ID is required');

    client.to(roomId).emit('drawUpdated', {
      playerId: client.data.playerId,
      drawingData: data.drawingData,
    });
  }
}
