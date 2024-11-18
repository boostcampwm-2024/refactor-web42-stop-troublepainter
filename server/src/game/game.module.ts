import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [GameService, GameGateway],
  controllers: [GameController],
})
export class GameModule {}
