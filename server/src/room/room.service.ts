import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { Room } from './room.interface';
import { v4 } from 'uuid';

@Injectable()
export class RoomService {
    constructor(private readonly redisService: RedisService) {}

    async createRoom(hostId: string) {
        try {
            const roomId = v4();
            const room: Room = {
                roomId,
                players: [hostId],
                hostId,
            };
            await this.redisService.setJson(`room:${roomId}`, room);
            return { success: true, data: room };
        } catch(error) {
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to create room' 
            };
        }
    }

    async joinRoom(roomId: string, playerId: string) {
        try {
            const room = await this.getRoom(roomId);
            
            if (!room) {
                return { success: false, error: 'Room not found' };
            }

            if (room.players.includes(playerId)) {
                return { success: false, error: 'Player already in room' };
            }
        
            room.players.push(playerId);
            await this.redisService.setJson(`room:${roomId}`, room);
            
            return { success: true, data: room };
        } catch (error) {
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to join room' 
            };
        }
    }
    
    async leaveRoom(roomId: string, playerId: string) {
        try {
            const room = await this.getRoom(roomId);
            
            if (!room) {
                return { success: false, error: 'Room not found' };
            }
        
            room.players = room.players.filter(id => id !== playerId);
            
            if (room.players.length === 0) {
                await this.redisService.del(`room:${roomId}`);
                return { success: true, data: { isDeleted: true } };
            }

            if (room.hostId === playerId && room.players.length > 0) {
                room.hostId = room.players[0];
            }
        
            await this.redisService.setJson(`room:${roomId}`, room);
            return { success: true, data: { isDeleted: false, room } };
        } catch (error) {
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to leave room' 
            };
        }
    }
    
    async getRoom(roomId: string): Promise<Room | null> {
        return this.redisService.getJson(`room:${roomId}`);
    }
}
