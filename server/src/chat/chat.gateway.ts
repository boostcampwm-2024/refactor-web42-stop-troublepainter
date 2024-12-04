import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { UseFilters } from '@nestjs/common';
import { WsExceptionFilter } from 'src/filters/ws-exception.filter';
import { BadRequestException, PlayerNotFoundException, RoomNotFoundException } from 'src/exceptions/game.exception';

@WebSocketGateway({
  cors: '*',
  namespace: '/socket.io/chat',
})
@UseFilters(WsExceptionFilter)
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const roomId = client.handshake.auth.roomId;
    const playerId = client.handshake.auth.playerId;

    if (!roomId || !playerId) throw new BadRequestException('Room ID and Player ID are required');

    const roomExists = this.chatService.existsRoom(roomId);
    if (!roomExists) throw new RoomNotFoundException('Room not found');
    const playerExists = this.chatService.existsPlayer(roomId, playerId);
    if (!playerExists) throw new PlayerNotFoundException('Player not found in room');

    client.data.roomId = roomId;
    client.data.playerId = playerId;

    client.join(roomId);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(@ConnectedSocket() client: Socket, @MessageBody() data: { message: string }) {
    const roomId = client.data.roomId;
    const playerId = client.data.playerId;

    if (!roomId || !playerId) throw new BadRequestException('Room ID and Player ID are required');

    const newMessage = await this.chatService.sendMessage(roomId, playerId, data.message);

    client.to(roomId).emit('messageReceived', newMessage);
  }
}
