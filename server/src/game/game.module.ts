import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { RoomService } from 'src/room/room.service';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [GameGateway, RoomService]
})
export class GameModule {}
