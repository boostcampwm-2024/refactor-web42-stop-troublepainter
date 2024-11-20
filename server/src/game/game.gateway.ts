import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { UseFilters } from '@nestjs/common';
import { WsExceptionFilter } from 'src/filters/ws-exception.filter';

@WebSocketGateway({
  cors: '*',
  namespace: 'game',
})
@UseFilters(WsExceptionFilter)
export class GameGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly gameService: GameService) {}

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string }) {
    const { room, roomSettings, player, players } = await this.gameService.joinRoom(data.roomId);

    client.data.playerId = player.playerId;
    client.data.roomId = room.roomId;

    await client.join(room.roomId);

    client.to(room.roomId).emit('playerJoined', { room, roomSettings, players });

    this.server.to(client.id).emit('joinedRoom', { room, roomSettings, playerId: player.playerId, players });
  }

  @SubscribeMessage('reconnect')
  async handleReconnect(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string; playerId: string; }) {
    const { roomId, playerId } = data;

    const { room, players, roomSettings } = await this.gameService.reconnect(roomId, playerId);

    client.data.playerId = playerId;
    client.data.roomId = roomId;

    await client.join(roomId);

    this.server.to(client.id).emit('joinedRoom', {
      room,
      roomSettings,
      playerId,
      players,
    });

    client.to(roomId).emit('playerJoined', {
      room,
      roomSettings,
      players,
    });
  }

  async handleDisconnect(client: Socket) {
    const { playerId, roomId } = client.data;
    if (!playerId || !roomId) return;

    setTimeout(async () => {
      const sockets = await this.server.fetchSockets();
      const isReconnected = sockets.some((socket) => socket.data.playerId === playerId);

      if (!isReconnected) {
        const players = await this.gameService.leaveRoom(roomId, playerId);
        if (!players) return;
        this.server.to(roomId).emit('playerLeft', {
          leftPlayerId : playerId,
          players,
        });
      }
    }, 10000);
  }
}
