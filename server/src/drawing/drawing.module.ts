import { Module } from '@nestjs/common';
import { DrawingGateway } from './drawing.gateway';

@Module({
  providers: [DrawingGateway]
})
export class DrawingModule {}
