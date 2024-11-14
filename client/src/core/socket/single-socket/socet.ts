import { io, Socket } from 'socket.io-client';
import type { ServerToClientEvents, ClientToServerEvents, Room, DrawingData } from '@/types/socket.types';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export class SocketManager {
  private static instance: SocketManager;
  private socket: Socket<ServerToClientEvents, ClientToServerEvents>;

  private constructor() {
    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
    });
    this.setupListeners();
  }

  static getInstance(): SocketManager {
    if (!this.instance) {
      this.instance = new SocketManager();
    }
    return this.instance;
  }

  private setupListeners() {
    this.socket.on('connect', () => {
      console.log('Connected with ID:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected');
    });
  }

  // Room 관련
  createRoom(): Promise<Room> {
    return new Promise((resolve, reject) => {
      this.socket.emit('createRoom', (response) => {
        if (response.success && response.data) {
          resolve(response.data);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  joinRoom(roomId: string): Promise<Room> {
    return new Promise((resolve, reject) => {
      this.socket.emit('joinRoom', roomId, (response) => {
        if (response.success && response.data) {
          resolve(response.data);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  // Drawing 관련
  sendDrawing(roomId: string, drawingData: DrawingData): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket.emit('drawing', { roomId, ...drawingData }, (response) => {
        if (response.success) {
          resolve();
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  // 이벤트 리스너
  onPlayerJoined(callback: ServerToClientEvents['playerJoined']) {
    this.socket.on('playerJoined', callback);
  }

  onDrawingUpdate(callback: ServerToClientEvents['drawUpdate']) {
    this.socket.on('drawUpdate', callback);
  }

  // 리스너 제거
  off(event: keyof ServerToClientEvents) {
    this.socket.off(event);
  }

  get id(): string {
    if (!this.socket.id) {
      throw new Error('Socket is not connected');
    }
    return this.socket.id;
  }

  disconnect() {
    this.socket.disconnect();
  }
}
