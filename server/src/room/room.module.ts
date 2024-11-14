import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {}
