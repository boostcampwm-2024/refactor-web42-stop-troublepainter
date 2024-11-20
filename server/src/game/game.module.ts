import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { RedisModule } from 'src/redis/redis.module';
import { GameRepository } from './game.repository';

@Module({
  imports: [RedisModule],
  providers: [GameService, GameGateway, GameRepository],
  controllers: [GameController],
})
export class GameModule {}
