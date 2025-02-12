import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { RedisModule } from 'src/redis/redis.module';
import { GameRepository } from './game.repository';
import { TimerService } from 'src/common/services/timer.service';
import { ClovaClient } from 'src/common/clova-client';
import { CanvasService } from '../common/services/canvas.service';
import { ClovaOcr } from '../common/clova-ocr';
import { ClovaStudio } from '../common/clova-studio';

@Module({
  imports: [RedisModule],
  providers: [
    GameService,
    GameGateway,
    GameRepository,
    TimerService,
    ClovaClient,
    CanvasService,
    ClovaOcr,
    ClovaStudio,
  ],
  controllers: [GameController],
})
export class GameModule {}
