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

@WebSocketGateway({
  cors: '*',
  namespace: 'game',
})
export class GameGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly gameService: GameService) {}

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string }) {
    const { room, roomSettings, player } = await this.gameService.joinRoom(data.roomId);

    const players = (await this.gameService.getRoomPlayers(data.roomId)).reverse();

    client.data.playerId = player.playerId;
    client.data.roomId = room.roomId;

    await client.join(room.roomId);

    client.to(room.roomId).emit('playerJoined', { room, roomSettings, players });

    this.server.to(client.id).emit('joinedRoom', { room, roomSettings, playerId: player.playerId, players });
  }

  @SubscribeMessage('reconnect')
  async handleReconnect(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string; playerId: string; }) {
    const { playerId, roomId } = data;

    const room = await this.gameService.getRoom(roomId);
    if (!room) {
      client.emit('error', { message: 'Room not found' });
      return;
    }

    const players = await this.gameService.getRoomPlayers(roomId);
    const existingPlayer = players.find((p) => p.playerId === playerId);

    const roomSettings = await this.gameService.getRoomSettings(roomId);

    if (!existingPlayer) {
      client.emit('error', { message: 'Player not found' });
      return;
    }

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
        const updatedRoom = await this.gameService.removePlayer(roomId, playerId);
        if (updatedRoom) {
          const players = await this.gameService.getRoomPlayers(roomId);
          this.server.to(roomId).emit('playerLeft', {
            leftPlayerId : playerId,
            players,
          });
        }
      }
    }, 10000);
  }
}
