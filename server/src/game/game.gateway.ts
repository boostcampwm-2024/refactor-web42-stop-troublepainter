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
import { RoomSettings } from 'src/common/types/game.types';
import { BadRequestException } from 'src/exceptions/game.exception';
import { PlayerRole } from 'src/common/enums/game.status.enum';

@WebSocketGateway({
  cors: '*',
  namespace: 'game',
})
@UseFilters(WsExceptionFilter)
export class GameGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private disconnectTimeouts: Map<string, NodeJS.Timeout> = new Map();
  private readonly DISCONNECT_TIMEOUT = 10000;

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
  async handleReconnect(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string; playerId: string }) {
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

  @SubscribeMessage('updateSettings')
  async handleSettings(@ConnectedSocket() client: Socket, @MessageBody() data: Partial<RoomSettings>) {
    const { playerId, roomId } = client.data;

    const updatedSettings = await this.gameService.updateSettings(roomId, playerId, data);

    client.to(roomId).emit('settingsUpdated', updatedSettings);
    this.server.to(client.id).emit('settingsUpdated', updatedSettings);
  }

  @SubscribeMessage('gameStart')
  async handleGameStart(@ConnectedSocket() client: Socket) {
    const { playerId, roomId } = client.data;

    const { room, roomSettings, players } = await this.gameService.startGame(roomId, playerId);

    const roles = players.reduce(
      (acc, player) => {
        if (player.role === PlayerRole.PAINTER) acc.painters.push(player.playerId);
        else if (player.role === PlayerRole.DEVIL) acc.devils.push(player.playerId);
        else acc.guessers.push(player.playerId);
        return acc;
      },
      { painters: [], devils: [], guessers: [] },
    );

    const sockets = await this.server.in(roomId).fetchSockets();

    for (const player of players) {
      const playerSocket = sockets.find((socket) => socket.data.playerId === player.playerId);
      if (!playerSocket) continue;

      if (player.role === PlayerRole.PAINTER || player.role === PlayerRole.DEVIL) {
        this.server.to(playerSocket.id).emit('drawingGroupRoundStarted', {
          roundNumber: room.currentRound,
          assignedRole: player.role,
          roles,
          word: room.currentWord,
          drawTime: roomSettings.drawTime,
        });
      } else {
        this.server.to(playerSocket.id).emit('guesserRoundStarted', {
          roundNumber: room.currentRound,
          assignedRole: player.role,
          roles: { guessers: roles.guessers },
          drawTime: roomSettings.drawTime,
        });
      }
    }
  }

  async handleDisconnect(client: Socket) {
    const { playerId, roomId } = client.data;
    if (!playerId || !roomId) throw new BadRequestException('Room ID and Player ID are required');

    const existingTimeout = this.disconnectTimeouts.get(playerId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      this.disconnectTimeouts.delete(playerId);
    }

    const timeout = setTimeout(async () => {
      try {
        const sockets = await this.server.fetchSockets();
        const isReconnected = sockets.some((socket) => socket.data.playerId === playerId);

        if (!isReconnected) {
          const players = await this.gameService.leaveRoom(roomId, playerId);
          if (!players) return;
          this.server.to(roomId).emit('playerLeft', {
            leftPlayerId: playerId,
            players,
          });
        }
      } finally {
        this.disconnectTimeouts.delete(playerId);
      }
    }, this.DISCONNECT_TIMEOUT);
    this.disconnectTimeouts.set(playerId, timeout);
  }
}
