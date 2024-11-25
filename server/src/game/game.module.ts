import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { RedisModule } from 'src/redis/redis.module';
import { GameRepository } from './game.repository';
import { TimerService } from 'src/common/services/timer.service';

@Module({
  imports: [RedisModule],
  providers: [GameService, GameGateway, GameRepository, TimerService],
  controllers: [GameController],
})
export class GameModule {}
