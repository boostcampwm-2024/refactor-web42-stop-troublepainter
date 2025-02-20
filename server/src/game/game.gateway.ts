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
import { Player, Room, RoomSettings } from 'src/common/types/game.types';
import { BadRequestException } from 'src/exceptions/game.exception';
import { PlayerRole, RoomStatus, TerminationType } from 'src/common/enums/game.status.enum';
import { TimerService } from 'src/common/services/timer.service';
import { TimerType } from 'src/common/enums/game.timer.enum';
import { CanvasService } from '../common/services/canvas.service';
import { RedisService } from '../redis/redis.service';
import { ClovaOcr } from '../common/clova-ocr';
import { ClovaStudio } from '../common/clova-studio';

@WebSocketGateway({
  cors: '*',
  namespace: '/socket.io/game',
})
@UseFilters(WsExceptionFilter)
export class GameGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private disconnectTimeouts: Map<string, NodeJS.Timeout> = new Map();
  private readonly DISCONNECT_TIMEOUT = 10000;
  private paneltyMap = new Map<string, { playerId: string; paneltyWords: string[] }[]>();

  constructor(
    private readonly gameService: GameService,
    private readonly timerService: TimerService,
    private readonly canvasService: CanvasService,
    private readonly redisService: RedisService,
    private readonly clovaOcr: ClovaOcr,
    private readonly clovaStudio: ClovaStudio,
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

  @SubscribeMessage('test:joinRoom')
  async handleTestJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; playerId: string },
  ) {
    const { room, roomSettings, player, players } = await this.gameService.testJoinRoom(data.roomId, data.playerId);

    client.data.playerId = player.playerId;
    client.data.roomId = room.roomId;

    await client.join(room.roomId);

    client.to(room.roomId).emit('playerJoined', { room, roomSettings, players });

    this.server.to(client.id).emit('joinedRoom', { room, roomSettings, playerId: player.playerId, players });
  }

  @SubscribeMessage('reconnect')
  async handleReconnect(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string; playerId: string }) {
    const { roomId, playerId } = data;

    client.data.playerId = playerId;
    client.data.roomId = roomId;

    await client.join(roomId);

    const { room, players, roomSettings } = await this.gameService.reconnect(roomId, playerId);

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

  @SubscribeMessage('updatePlayer')
  async handle(@ConnectedSocket() client: Socket, @MessageBody() data: { player: Partial<Player> }) {
    const { playerId, roomId } = client.data;
    if (!roomId || !playerId) throw new BadRequestException('Room ID and Player ID are required');

    const updatedPlayer = await this.gameService.updatePlayer(roomId, playerId, data.player);

    client.to(roomId).emit('playerUpdated', { player: updatedPlayer });
  }

  @SubscribeMessage('gameStart')
  async handleGameStart(@ConnectedSocket() client: Socket) {
    const { playerId, roomId } = client.data;
    if (!playerId || !roomId) throw new BadRequestException('Room ID and Player ID are required');

    await this.gameService.startGame(roomId, playerId);

    await this.startNewRound(roomId);
  }

  private async startNewRound(roomId: string) {
    const gameState = await this.gameService.setupRound(roomId);
    if (gameState.gameEnded) {
      this.server.to(roomId).emit('gameEnded', {
        terminationType: TerminationType.SUCCESS,
      });
      return;
    }

    const { room, roomSettings, roles, players } = gameState;

    await this.notifyPlayersRoundStart(roomId, room, roomSettings, roles, players);

    // 라운드가 시작되면 가상 room 생성 및 pub/sub으로 데이터 수신 시작
    this.canvasService.createRoom(roomId);
    await this.redisService.subscribe(`drawing:${roomId}`, (message) => {
      const { drawingData } = JSON.parse(message);
      this.canvasService.applyDrawing(roomId, drawingData);
    });

    // 현재 라운드의 제시어를 확인
    const currentWord = await this.gameService.getCurrentWord(roomId);

    await this.runTimer(roomId, roomSettings.drawTime * 1000, TimerType.DRAWING);

    // drawing 시간이 종료되면 OCR 및 선 삭제하는 시간으로 변경할 수 있도록 수정
    let roomStatus = await this.gameService.handleDrawingTimeout(roomId);
    this.server.to(roomId).emit('drawingTimeEnded', {
      roomStatus,
    });

    const timerPromise = this.runTimer(roomId, 5000, TimerType.OCR);

    // OCR 작업
    const paneltyList = [];
    {
      const imageBuffer = await this.canvasService.generateImageBuffer(roomId);
      const ocrResult = (await this.clovaOcr.doOCR(imageBuffer)) as OCRResult;
      const fields = ocrResult.images[0].fields;
      const boundaries = fields.map((field) => field.boundingPoly.vertices);
      const playerIds = await Promise.all(
        boundaries.map((boundary) => this.canvasService.getPlayerIdByBoundary(roomId, boundary)),
      );
      const words = fields.map((field) => field.inferText);
      const wordsGroupByPlayerId = words.reduce((acc: Record<string, string[]>, word, index) => {
        const playerId = playerIds[index];
        if (!playerId) return acc;
        if (!(playerId in acc)) acc[playerId] = [];
        acc[playerId].push(word);
        return acc;
      }, {});

      // 패널티 작업
      await Promise.all(
        Object.entries(wordsGroupByPlayerId).map(async ([playerId, words]) => {
          const paneltyWords = await this.filterRelatedWord(currentWord, words);
          if (paneltyWords.length > 0) {
            await this.gameService.applyPenalty(roomId, playerId);
            paneltyList.push({ playerId, paneltyWords });
          }
        }),
      );
      this.paneltyMap.set(roomId, paneltyList);

      // 선 삭제
      const eraseMessage = await this.canvasService.getEraseLineMessage(roomId, boundaries);
      await this.redisService.publish(
        `erasing:${roomId}`,
        JSON.stringify({
          playerId: '*',
          drawingData: eraseMessage,
        }),
      );
    }

    await timerPromise;

    // OCR 및 선 삭제 로직이 종료된 이후 추측 시간으로 변경
    roomStatus = await this.gameService.handleOCRTimeout(roomId);
    this.server.to(roomId).emit('ocrTimeEnded', {
      roomStatus,
    });

    await this.runTimer(roomId, 15000, TimerType.GUESSING);
    const result = await this.gameService.handleGuessingTimeout(roomId);
    this.server.to(roomId).emit('roundEnded', result);

    if (paneltyList.length > 0) {
      this.server.to(roomId).emit('penaltyMessage', paneltyList);
    }
    this.paneltyMap.delete(roomId);

    // 라운드가 종료되면 가상 room 제거 및 구독 해제
    this.canvasService.removeRoom(roomId);
    await this.redisService.unsubscribe(`drawing:${roomId}`);

    await this.runTimer(roomId, 10000, TimerType.ENDING);
    await this.startNewRound(roomId);
  }

  private async notifyPlayersRoundStart(
    roomId: string,
    room: Room,
    roomSettings: RoomSettings,
    roles: { painters: string[]; devils: string[]; guessers: string[] },
    players: Player[],
  ) {
    const sockets = await this.server.in(roomId).fetchSockets();
    for (const player of players) {
      const playerSocket = sockets.find((socket) => socket.data.playerId === player.playerId);
      if (!playerSocket) continue;

      const basePayload = {
        roundNumber: room.currentRound,
        assignedRole: player.role,
        roles,
        drawTime: roomSettings.drawTime,
        roomStatus: room.status,
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
  }

  private async runTimer(roomId: string, duration: number, timerType: TimerType) {
    return new Promise<void>((resolve) => {
      this.timerService.startTimer(this.server, roomId, duration, {
        onTick: (remaining: number) => {
          this.server.to(roomId).emit('timerSync', { remaining, timerType });
        },
        onTimeUp: () => resolve(),
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
      const paneltyList = this.paneltyMap.get(roomId);
      if (paneltyList && paneltyList.length > 0) {
        this.server.to(roomId).emit('penaltyMessage', paneltyList);
      }
      this.paneltyMap.delete(roomId);
      await this.runTimer(roomId, 10000, TimerType.ENDING);
      await this.startNewRound(roomId);
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    try {
      const { playerId, roomId } = client.data;
      if (!playerId || !roomId) {
        console.error('Disconnect error: Missing room ID or player ID');
        return;
      }

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
            const { roomStatus, hostId, remainingPlayers } = await this.gameService.leaveRoom(roomId, playerId);

            if (roomStatus === RoomStatus.WAITING) {
              this.server.to(roomId).emit('playerLeft', {
                leftPlayerId: playerId,
                hostId,
                players: remainingPlayers,
              });
              return;
            }

            this.timerService.stopGameTimer(roomId);

            await this.gameService.initializeGame(roomId);

            this.server.to(roomId).emit('gameEnded', {
              terminationType: TerminationType.PLAYER_DISCONNECT,
              leftPlayerId: playerId,
              hostId,
              players: remainingPlayers,
            });
            this.paneltyMap.delete(roomId);
          }
        } catch (error) {
          console.error('Disconnect timeout error:', error);
        } finally {
          this.disconnectTimeouts.delete(playerId);
        }
      }, this.DISCONNECT_TIMEOUT);

      this.disconnectTimeouts.set(playerId, timeout);
    } catch (error) {
      console.error('Disconnect handler error:', error);
    }
  }

  // 캔버스 내 인식된 단어 중 제시어와 연관된 단어들을 배열로 반환.
  private async filterRelatedWord(suggestedWord: string, inferTexts: string[]) {
    const isRelatedList = await Promise.all(
      inferTexts.map((word) => this.clovaStudio.isRelatedWord(suggestedWord, word)),
    );
    return inferTexts.filter((_, i) => isRelatedList[i]);
  }
}

interface OCRResult {
  version: string;
  requestId: string;
  timestamp: number;
  images: Array<{
    uid: string;
    name: string;
    inferResult: string;
    message: string;
    validationResult: {
      result: string;
    };
    fields: Array<{
      valueType: string;
      boundingPoly: {
        vertices: Array<{
          x: number;
          y: number;
        }>;
      };
      inferText: string;
      inferConfidence: number;
      type: string;
      lineBreak: boolean;
    }>;
  }>;
}
