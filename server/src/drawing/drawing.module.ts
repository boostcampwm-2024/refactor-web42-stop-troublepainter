import { Module } from '@nestjs/common';
import { DrawingGateway } from './drawing.gateway';
import { RedisModule } from 'src/redis/redis.module';
import { DrawingService } from './drawing.service';
import { DrawingRepository } from './drawing.repository';

@Module({
  imports: [RedisModule],
  providers: [DrawingGateway, DrawingService, DrawingRepository],
})
export class DrawingModule {}
