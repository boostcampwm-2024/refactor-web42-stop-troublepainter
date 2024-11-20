import { Injectable } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { BadRequestException, PlayerNotFoundException } from 'src/exceptions/game.exception';

@Injectable()
export class ChatService {
  constructor(private readonly chatRepository: ChatRepository) {}
  
  async sendMessage(roomId: string, playerId: string, message: string) {
    if (!message?.trim()) {
      throw new BadRequestException('Message cannot be empty');
    }

    const player = await this.chatRepository.getPlayer(roomId, playerId);
    if (!player) throw new PlayerNotFoundException();
  
    return {
      playerId,
      nickname: player.nickname,
      message,
      createdAt: new Date(),
    };
  }
}
