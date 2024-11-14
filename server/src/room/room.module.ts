import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomGateway } from './room.gateway';

@Module({
  providers: [RoomService, RoomGateway]
})
export class RoomModule {}
