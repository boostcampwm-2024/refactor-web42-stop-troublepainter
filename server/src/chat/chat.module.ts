import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { RedisModule } from 'src/redis/redis.module';
import { ChatService } from './chat.service';
import { ChatRepository } from './chat.repository';

@Module({
  imports: [RedisModule],
  providers: [ChatGateway, ChatService, ChatRepository]
})
export class ChatModule {}
