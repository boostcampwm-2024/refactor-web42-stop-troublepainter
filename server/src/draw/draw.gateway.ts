import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: '*',
  namespace: 'draw',
})
export class DrawGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const roomId = client.handshake.auth.roomId;
    const playerId = client.handshake.auth.playerId;

    if (!roomId || !playerId) return;

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
    if (!roomId) return;

    client.to(roomId).emit('drawUpdated', {
      playerId: client.data.playerId,
      drawingData: data.drawingData,
    });
  }
}
