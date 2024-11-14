import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './redis/redis.module';
import { ConfigModule } from '@nestjs/config';
import { RoomModule } from './room/room.module';
import { DrawingModule } from './drawing/drawing.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    RedisModule,
    RoomModule,
    DrawingModule,
  ],  
})
export class AppModule {}
