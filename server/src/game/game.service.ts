import { Injectable } from '@nestjs/common';
import { Player, Room, RoomSettings } from 'src/common/types/game.types';
import { v4 } from 'uuid';
import { GameRepository } from './game.repository';
import {
  PlayerNotFoundException,
  RoomFullException,
  RoomNotFoundException,
  BadRequestException,
  InsufficientPlayersException,
  ForbiddenException,
  GameAlreadyStartedException,
} from 'src/exceptions/game.exception';
import { RoomStatus, PlayerStatus, PlayerRole, Difficulty } from 'src/common/enums/game.status.enum';
import { ClovaClient } from 'src/common/clova-client';

@Injectable()
export class GameService {
  private readonly DEFAULT_ROOM_SETTINGS: RoomSettings = {
    maxPlayers: 5,
    totalRounds: 5,
    drawTime: 35,
  };
  private static readonly DEFAULT_WORDS = [
    '아이언맨',
    '토르',
    '스파이더맨',
    '호빵맨',
    '도라에몽',
    '짱구',
    '레옹',
    '토토로',
    '가오나시',
    '개발자',
    '대통령',
  ];
  private words: string[] = [];

  constructor(
    private readonly gameRepository: GameRepository,
    private readonly clovaClient: ClovaClient,
  ) {}

  async createRoom(): Promise<string> {
    const roomId = v4();
    const room: Room = {
      roomId: roomId,
      hostId: null,
      status: RoomStatus.WAITING,
      currentRound: 0,
      currentWord: null,
    };

    await this.gameRepository.createRoom(roomId, room, this.DEFAULT_ROOM_SETTINGS);

    return roomId;
  }

  async joinRoom(roomId: string) {
    const [room, roomSettings, players] = await Promise.all([
      this.gameRepository.getRoom(roomId),
      this.gameRepository.getRoomSettings(roomId),
      this.gameRepository.getRoomPlayers(roomId),
    ]);

    if (!room) throw new RoomNotFoundException();
    if (room.status === RoomStatus.GUESSING || room.status === RoomStatus.DRAWING) {
      throw new GameAlreadyStartedException('Cannot join room while game is in progress');
    }
    if (!roomSettings) throw new RoomNotFoundException('Room settings not found');
    if (players.length >= roomSettings.maxPlayers) {
      throw new RoomFullException('Room is full');
    }

    const playerId = v4();
    const nickname = this.generateNickname();
    const player: Player = {
      playerId,
      role: null,
      status: PlayerStatus.NOT_PLAYING,
      nickname,
      profileImage: `https://api.dicebear.com/9.x/pixel-art/svg?seed=${nickname}`,
      score: 0,
    };

    const isFirstPlayer = players.length === 0;
    if (isFirstPlayer) {
      room.hostId = playerId;
      await this.gameRepository.updateRoom(roomId, { hostId: playerId });
    }

    await this.gameRepository.addPlayerToRoom(roomId, playerId, player);

    const updatedPlayers = [player, ...players].reverse();

    return { room, roomSettings, player, players: updatedPlayers };
  }

  private generateNickname() {
    const adjectives = [
      '귀여운',
      '용감한',
      '즐거운',
      '행복한',
      '웃는',
      '똑똑한',
      '현명한',
      '멋진',
      '활발한',
      '착한',
      '신나는',
      '재미있는',
      '발랄한',
      '영리한',
      '친절한',
    ];

    const nouns = [
      '판다',
      '호랑이',
      '토끼',
      '강아지',
      '고양이',
      '펭귄',
      '사자',
      '기린',
      '코끼리',
      '곰돌이',
      '여우',
      '늑대',
      '참새',
      '독수리',
      '돌고래',
    ];

    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];

    return `${adj} ${noun}`;
  }

  async reconnect(roomId: string, playerId: string) {
    const [room, roomSettings, players] = await Promise.all([
      this.gameRepository.getRoom(roomId),
      this.gameRepository.getRoomSettings(roomId),
      this.gameRepository.getRoomPlayers(roomId),
    ]);

    if (!room) throw new RoomNotFoundException('Room not found');
    if (!roomSettings) throw new RoomNotFoundException('Room settings not found');

    const existingPlayer = players.find((p) => p.playerId === playerId);
    if (!existingPlayer) throw new PlayerNotFoundException('Player not found');

    return { room, players, roomSettings };
  }

  async leaveRoom(roomId: string, playerId: string) {
    const [room, players] = await Promise.all([
      this.gameRepository.getRoom(roomId),
      this.gameRepository.getRoomPlayers(roomId),
    ]);

    if (!room) throw new RoomNotFoundException('Room not found');
    if (!players.some((p) => p.playerId === playerId)) throw new PlayerNotFoundException('Player not found');

    const remainingPlayers = players.filter((p) => p.playerId !== playerId);
    await this.gameRepository.removePlayerFromRoom(roomId, playerId);

    if (remainingPlayers.length === 0) {
      await this.gameRepository.deleteRoom(roomId);
      return { hostId: null, remainingPlayers: [] };
    }

    let hostId = room.hostId;
    if (hostId === playerId) {
      hostId = remainingPlayers[remainingPlayers.length - 1].playerId;
      await this.gameRepository.updateRoom(roomId, { hostId });
    }

    await this.gameRepository.removePlayerFromRoom(roomId, playerId);

    return { roomStatus: room.status, hostId, remainingPlayers };
  }

  async initializeGame(roomId: string) {
    await this.gameRepository.updateRoom(roomId, { status: RoomStatus.WAITING, currentRound: 0, currentWord: null });
    const players = await this.gameRepository.getRoomPlayers(roomId);
    await Promise.all(
      players.map(({ playerId }) =>
        this.gameRepository.updatePlayer(roomId, playerId, {
          status: PlayerStatus.NOT_PLAYING,
          role: null,
          score: 0,
        }),
      ),
    );
  }

  async updateSettings(roomId: string, playerId: string, data: Partial<RoomSettings>) {
    const room = await this.gameRepository.getRoom(roomId);
    if (!room) throw new RoomNotFoundException('Room not found');
    if (room.hostId !== playerId) throw new BadRequestException('Player is not the host');

    const roomSettings = await this.gameRepository.getRoomSettings(roomId);

    const updatedSettings = { ...roomSettings, ...data };
    await this.gameRepository.updateRoomSettings(roomId, updatedSettings);

    return updatedSettings;
  }

  async updatePlayer(roomId: string, playerId: string, data: Partial<Player>) {
    const room = await this.gameRepository.getRoom(roomId);
    if (!room) throw new RoomNotFoundException('Room not found');

    const player = await this.gameRepository.getPlayer(roomId, playerId);
    if (!player) throw new PlayerNotFoundException('Player not found');

    const updatedPlayer = { ...player, ...data };
    await this.gameRepository.updatePlayer(roomId, playerId, updatedPlayer);

    return updatedPlayer;
  }

  async startGame(roomId: string, playerId: string) {
    const room = await this.gameRepository.getRoom(roomId);
    if (!room) throw new RoomNotFoundException('Room not found');
    if (room.hostId !== playerId) throw new BadRequestException('Player is not the host');

    const players = await this.gameRepository.getRoomPlayers(roomId);
    if (!players || players.length < 4) {
      throw new InsufficientPlayersException('Not enough players to start game');
    }

    const roomSettings = await this.gameRepository.getRoomSettings(roomId);
    this.words = await this.fetchWords(roomSettings.totalRounds);
  }

  private async fetchWords(totalRounds: number): Promise<string[]> {
    let attempts = 0;
    while (attempts++ < 10) {
      const words = await this.clovaClient.getDrawingWords(Difficulty.HARD, totalRounds);
      if (words.length === totalRounds) return words;
    }
    return GameService.DEFAULT_WORDS.slice(0, totalRounds);
  }

  async setupRound(roomId: string) {
    const [room, roomSettings, players] = await Promise.all([
      this.gameRepository.getRoom(roomId),
      this.gameRepository.getRoomSettings(roomId),
      this.gameRepository.getRoomPlayers(roomId),
    ]);

    if (!room) throw new RoomNotFoundException('Room not found');

    if (room.currentRound >= roomSettings.totalRounds) {
      await this.initializeGame(roomId);
      return { gameEnded: true };
    }

    const roomUpdates = {
      status: RoomStatus.DRAWING,
      currentWord: this.words[room.currentRound],
      currentRound: room.currentRound + 1,
    };
    await this.gameRepository.updateRoom(roomId, { ...roomUpdates });

    const playersWithRoles = await this.distributeRoles(roomId, players);
    const roles = this.categorizePlayerRoles(playersWithRoles);

    return {
      gameEnded: false,
      room: { ...room, ...roomUpdates },
      roomSettings,
      roles,
      players: playersWithRoles,
    };
  }

  private async distributeRoles(roomId: string, players: Player[]) {
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const playerUpdates = shuffledPlayers.map((player, index) => ({
      playerId: player.playerId,
      updates: {
        status: PlayerStatus.PLAYING,
        role: this.determineRole(index),
      },
    }));

    await Promise.all(
      playerUpdates.map(({ playerId, updates }) => this.gameRepository.updatePlayer(roomId, playerId, updates)),
    );

    return shuffledPlayers.map((player, i) => ({
      ...player,
      ...playerUpdates[i].updates,
    }));
  }

  private determineRole(index: number): PlayerRole {
    if (index < 2) return PlayerRole.PAINTER;
    if (index === 2) return PlayerRole.DEVIL;
    return PlayerRole.GUESSER;
  }

  private categorizePlayerRoles(players: Player[]) {
    return players.reduce(
      (acc, { playerId, role }) => {
        if (role === PlayerRole.PAINTER) acc.painters.push(playerId);
        else if (role === PlayerRole.DEVIL) acc.devils.push(playerId);
        else if (role === PlayerRole.GUESSER) acc.guessers.push(playerId);
        return acc;
      },
      { painters: [], devils: [], guessers: [] },
    );
  }

  async handleDrawingTimeout(roomId: string) {
    const room = await this.gameRepository.getRoom(roomId);
    if (!room) throw new RoomNotFoundException('Room not found');

    await this.gameRepository.updateRoom(roomId, { status: RoomStatus.GUESSING });

    return RoomStatus.GUESSING;
  }

  async checkAnswer(roomId: string, playerId: string, answer: string) {
    const [room, players] = await Promise.all([
      this.gameRepository.getRoom(roomId),
      this.gameRepository.getRoomPlayers(roomId),
    ]);

    if (!room) throw new RoomNotFoundException('Room not found');
    if (room.status !== RoomStatus.GUESSING) {
      throw new BadRequestException('Room is not in guessing state');
    }

    const currentPlayer = players.find((p) => p.playerId === playerId);
    if (!currentPlayer) throw new PlayerNotFoundException('Player not found');

    if (currentPlayer.role === PlayerRole.PAINTER || currentPlayer.role === PlayerRole.DEVIL) {
      throw new ForbiddenException('Painters and Devils are not allowed to submit answers');
    }

    const isCorrect = room.currentWord.trim() === answer.trim();
    if (!isCorrect) return { isCorrect };

    const updatedPlayers = this.calculateScores(players, playerId);

    updatedPlayers.sort((a, b) => b.score - a.score);

    await Promise.all(
      updatedPlayers.map((p) => this.gameRepository.updatePlayer(roomId, p.playerId, { score: p.score })),
    );
    const painters = updatedPlayers.filter((p) => p.role === PlayerRole.PAINTER);
    const winner = updatedPlayers.find((p) => p.playerId === playerId);

    return {
      isCorrect,
      roundNumber: room.currentRound,
      word: room.currentWord,
      winners: [winner, ...painters],
      players: updatedPlayers,
    };
  }

  private calculateScores(players: Player[], winnerId: string): Player[] {
    return players.map((player) => {
      const updatedPlayer = { ...player };
      switch (player.role) {
        case PlayerRole.PAINTER:
          updatedPlayer.score += 2;
          break;
        case PlayerRole.GUESSER:
          if (player.playerId === winnerId) {
            updatedPlayer.score += 1;
          }
          break;
      }
      return updatedPlayer;
    });
  }

  async handleGuessingTimeout(roomId: string) {
    const [room, players] = await Promise.all([
      this.gameRepository.getRoom(roomId),
      this.gameRepository.getRoomPlayers(roomId),
    ]);

    if (!room) throw new RoomNotFoundException('Room not found');
    if (room.status !== RoomStatus.GUESSING) {
      throw new BadRequestException('Room is not in guessing state');
    }

    const updatedPlayers = players.map((p) => {
      const updatedPlayer = { ...p };
      if (p.role === PlayerRole.DEVIL) {
        updatedPlayer.score += 3;
      }
      return updatedPlayer;
    });

    updatedPlayers.sort((a, b) => b.score - a.score);

    await Promise.all(
      updatedPlayers.map((p) => this.gameRepository.updatePlayer(roomId, p.playerId, { score: p.score })),
    );

    const winner = updatedPlayers.find((p) => p.role === PlayerRole.DEVIL);
    if (!winner) throw new PlayerNotFoundException('Player not found');

    return {
      roundNumber: room.currentRound,
      word: room.currentWord,
      winners: [winner],
      players: updatedPlayers,
    };
  }
}
