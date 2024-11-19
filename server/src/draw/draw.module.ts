import { Module } from '@nestjs/common';
import { DrawGateway } from './draw.gateway';

@Module({
  providers: [DrawGateway]
})
export class DrawModule {}
