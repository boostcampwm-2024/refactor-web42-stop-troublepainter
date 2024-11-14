import { Socket } from 'socket.io-client';
import { socketManager, type SocketResponse } from '@/core/socket/muti-socket/socket';

export interface Room {
  roomId: string;
  players: string[];
  hostId: string;
}

export interface RoomEventData {
  playerId: string;
  room: Room;
}

export interface LeaveRoomResponse {
  isDeleted: boolean;
  room?: Room;
}

class RoomSocketManager {
  private socket: Socket;

  constructor() {
    this.socket = socketManager.getRoomSocket();
  }

  createRoom(): Promise<Room> {
    return new Promise((resolve, reject) => {
      this.socket.emit('create', (response: SocketResponse<Room>) => {
        if (response.success && response.data) {
          resolve(response.data);
        } else {
          reject(new Error(response.error || '방 생성에 실패했습니다.'));
        }
      });
    });
  }

  joinRoom(roomId: string): Promise<Room> {
    return new Promise((resolve, reject) => {
      this.socket.emit('join', roomId, (response: SocketResponse<Room>) => {
        if (response.success && response.data) {
          resolve(response.data);
        } else {
          reject(new Error(response.error || '방 참여에 실패했습니다.'));
        }
      });
    });
  }

  leaveRoom(roomId: string): Promise<LeaveRoomResponse> {
    return new Promise((resolve, reject) => {
      this.socket.emit('leave', roomId, (response: SocketResponse<LeaveRoomResponse>) => {
        if (response.success && response.data) {
          resolve(response.data);
        } else {
          reject(new Error(response.error || '방 나가기에 실패했습니다.'));
        }
      });
    });
  }

  onPlayerJoined(callback: (data: RoomEventData) => void) {
    this.socket.on('playerJoined', callback);
    return () => this.socket.off('playerJoined', callback);
  }

  onPlayerLeft(callback: (data: RoomEventData) => void) {
    this.socket.on('playerLeft', callback);
    return () => this.socket.off('playerLeft', callback);
  }

  cleanup() {
    this.socket.off('playerJoined');
    this.socket.off('playerLeft');
  }
}

export const roomSocketManager = new RoomSocketManager();
