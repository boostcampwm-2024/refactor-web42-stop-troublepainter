import { Module } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';
import { ConfigModule } from '@nestjs/config';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    RedisModule,
    GameModule,
  ],
})
export class AppModule {}
