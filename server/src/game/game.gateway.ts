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
import { TimerService } from 'src/common/services/timer.service';

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

  constructor(
    private readonly gameService: GameService,
    private readonly timerService: TimerService,
  ) {}

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

    // TODO: Timer sync
  }

  @SubscribeMessage('updateSettings')
  async handleSettings(@ConnectedSocket() client: Socket, @MessageBody() data: { settings: Partial<RoomSettings> }) {
    const { playerId, roomId } = client.data;
    if (!roomId || !playerId) throw new BadRequestException('Room ID and Player ID are required');

    const updatedSettings = await this.gameService.updateSettings(roomId, playerId, data.settings);

    client.to(roomId).emit('settingsUpdated', { settings: updatedSettings });
  }

  @SubscribeMessage('gameStart')
  async handleGameStart(@ConnectedSocket() client: Socket) {
    const { playerId, roomId } = client.data;
    if (!playerId || !roomId) throw new BadRequestException('Room ID and Player ID are required');

    const { room, roomSettings, roles, players } = await this.gameService.startGame(roomId, playerId);

    const sockets = await this.server.in(roomId).fetchSockets();

    for (const player of players) {
      const playerSocket = sockets.find((socket) => socket.data.playerId === player.playerId);
      if (!playerSocket) continue;

      const basePayload = {
        roundNumber: room.currentRound,
        assignedRole: player.role,
        roles,
        drawTime: roomSettings.drawTime,
      };

      if (player.role === PlayerRole.PAINTER || player.role === PlayerRole.DEVIL) {
        this.server.to(playerSocket.id).emit('drawingGroupRoundStarted', {
          ...basePayload,
          word: room.currentWord,
        });
      } else {
        this.server.to(playerSocket.id).emit('guesserRoundStarted', {
          ...basePayload,
          roles: { guessers: roles.guessers },
        });
      }
    }

    await new Promise<void>((resolve) => {
      this.timerService.startTimer(this.server, roomId, roomSettings.drawTime * 1000, {
        onTick: (remaining: number) => {
          this.server.to(roomId).emit('timerSync', { remaining });
        },
        onTimeUp: () => {
          resolve();
        },
      });
    });

    this.server.to(roomId).emit('drawingTimeEnded');
    await this.gameService.handleDrawingTimeout(roomId);

    await new Promise<void>((resolve) => {
      this.timerService.startTimer(this.server, roomId, 10000, {
        onTick: (remaining: number) => {
          this.server.to(roomId).emit('timerSync', { remaining });
        },
        onTimeUp: async () => {
          const result = await this.gameService.handleGuessingTimeout(roomId);
          this.server.to(roomId).emit('roundEnded', result);
          resolve();
        },
      });
    });
  }

  @SubscribeMessage('checkAnswer')
  async handleCheckAnswer(@ConnectedSocket() client: Socket, @MessageBody() data: { answer: string }) {
    const roomId = client.data.roomId;
    const playerId = client.data.playerId;

    if (!roomId || !playerId) throw new BadRequestException('Room ID and Player ID are required');

    const result = await this.gameService.checkAnswer(roomId, playerId, data.answer);

    if (result.isCorrect) {
      this.timerService.stopGameTimer(roomId);
      this.server.to(roomId).emit('roundEnded', result);
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
          const { hostId, remainingPlayers } = await this.gameService.leaveRoom(roomId, playerId);
          if (!remainingPlayers) {
            this.timerService.stopGameTimer(roomId);
            return;
          }

          this.server.to(roomId).emit('playerLeft', {
            leftPlayerId: playerId,
            hostId,
            players: remainingPlayers,
          });
        }
      } finally {
        this.disconnectTimeouts.delete(playerId);
      }
    }, this.DISCONNECT_TIMEOUT);
    this.disconnectTimeouts.set(playerId, timeout);
  }
}
