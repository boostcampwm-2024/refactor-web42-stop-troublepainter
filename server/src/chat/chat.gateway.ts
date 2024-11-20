import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from '../redis/redis.service';

@WebSocketGateway({
  cors: '*',
  namespace: 'chat',
})
export class ChatGateway {
  constructor(private readonly redisService: RedisService) {}

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

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket, 
    @MessageBody() data: { message: string }
  ) {
    const roomId = client.data.roomId;
    const playerId = client.data.playerId;
    
    if (!roomId || !playerId) return;

    const player = await this.redisService.hgetall(`room:${roomId}:players:${playerId}`);
    if (!player) return;

    client.to(roomId).emit('messageReceived', {
      playerId: client.data.playerId,
      nickname: player.nickname,
      message: data.message,
      createdAt: new Date(),
    });
  }
}
