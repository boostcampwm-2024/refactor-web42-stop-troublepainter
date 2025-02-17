import { Module } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';
import { ConfigModule } from '@nestjs/config';
import { GameModule } from './game/game.module';
import { ChatModule } from './chat/chat.module';
import { DrawingModule } from './drawing/drawing.module';
import { WinstonLogger } from './configs/logger.config';
import { WinstonModule } from 'nest-winston';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    WinstonModule.forRoot(WinstonLogger),
    RedisModule,
    GameModule,
    ChatModule,
    DrawingModule,
  ],
})
export class AppModule {}
