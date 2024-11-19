import { Test, TestingModule } from '@nestjs/testing';
import { DrawGateway } from './draw.gateway';

describe('DrawGateway', () => {
  let gateway: DrawGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DrawGateway],
    }).compile();

    gateway = module.get<DrawGateway>(DrawGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
