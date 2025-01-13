import { ChatModule } from './chat.module';
import { Test } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { ChatRepository } from './chat.repository';
import { RedisModule } from '../redis/redis.module';
import { ChatGateway } from './chat.gateway';

describe('ChatModule', () => {
  it('컴파일 확인', async () => {
    const module = await Test.createTestingModule({
      imports: [ChatModule],
    }).compile();

    expect(module).toBeDefined();
    expect(module.get(ChatService)).toBeInstanceOf(ChatService);
    expect(module.get(ChatRepository)).toBeInstanceOf(ChatRepository);
    expect(module.get(ChatGateway)).toBeInstanceOf(ChatGateway);
    expect(module.get(RedisModule)).toBeInstanceOf(RedisModule);
  });
});
