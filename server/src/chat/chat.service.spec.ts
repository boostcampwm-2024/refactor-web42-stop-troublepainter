import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { ChatRepository } from './chat.repository';
import { ModuleMocker } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);

describe('ChatService', () => {
  let chatService: ChatService;
  let chatRepository: ChatRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatService],
    }).compile();

    chatService = module.get<ChatService>(ChatService);
  });
});
