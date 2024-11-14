import { Module } from '@nestjs/common';
import { DrawingGateway } from './drawing.gateway';
import { RoomModule } from 'src/room/room.module';

@Module({
  imports: [RoomModule],
  providers: [DrawingGateway]
})
export class DrawingModule {}
