import { Module } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';
import { ConfigModule } from '@nestjs/config';
import { GameModule } from './game/game.module';
import { ChatModule } from './chat/chat.module';
import { DrawingModule } from './drawing/drawing.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    RedisModule,
    GameModule,
    ChatModule,
    DrawingModule,
  ],
})
export class AppModule {}
