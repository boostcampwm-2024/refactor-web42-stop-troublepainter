import { Injectable } from '@nestjs/common';
import { DrawingRepository } from './drawing.repository';

@Injectable()
export class DrawingService {
  constructor(private readonly drawingRepository: DrawingRepository) {}

  async existsRoom(roomId: string) {
    return await this.drawingRepository.existsRoom(roomId);
  }

  async existsPlayer(roomId: string, playerId: string) {
    return await this.drawingRepository.existsPlayer(roomId, playerId);
  }
}
