import { Injectable } from '@nestjs/common';
import { Room, RoomSettings, RoomStatus } from 'src/types/game.types';
import { v4 } from 'uuid';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class GameService {
    private readonly DEFAULT_ROOM_SETTINGS: RoomSettings = {
        maxPlayers: 5,
        totalRounds: 5,
        drawTime: 30,
    };

    constructor(private readonly redisService:RedisService) {}
    
    async createRoom(): Promise<string> {
        const uuidv4 = v4();
        const roomSettingsKey = `room:${uuidv4}:settings`;
        const roomStateKey = `room:${uuidv4}:state`;

        const roomSettings: RoomSettings = {
            ...this.DEFAULT_ROOM_SETTINGS
        };

        const roomState: Room ={
            hostId: null,
            players: [],
            status: RoomStatus.WAITING,
            currentRound: 0,
            totalRounds: this.DEFAULT_ROOM_SETTINGS.totalRounds,
            currentWord: null,
        }

        await Promise.all([
            this.redisService.hset(roomSettingsKey, roomSettings),
            this.redisService.hset(roomStateKey, roomState)
        ]);

        return uuidv4;
    }
}
