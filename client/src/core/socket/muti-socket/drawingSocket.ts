import { Socket } from 'socket.io-client';
import { socketManager, type SocketResponse } from '@/core/socket/muti-socket/socket';

export interface DrawingPoint {
  x: number;
  y: number;
  pressure?: number;
}

export interface StrokeStyle {
  color: string;
  width: number;
  cap?: 'round' | 'square' | 'butt';
}

export type DrawingMode = 'pen' | 'fill';

export interface DrawingData {
  roomId: string;
  points?: DrawingPoint[];
  style?: StrokeStyle;
  mode?: DrawingMode;
  // fill 모드일 때 사용
  fillPoint?: DrawingPoint;
  fillColor?: string;
  // 잉크 소비량 계산을 위한 필드
  pixelsUsed?: number;
}

export interface DrawingUpdateData extends DrawingData {
  playerId: string; // 어떤 플레이어가 그렸는지
  timestamp: number; // CRDT를 위한 타임스탬프
}

class DrawingSocketManager {
  private socket: Socket;

  constructor() {
    this.socket = socketManager.getDrawingSocket();
  }

  sendDrawing(data: DrawingData): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket.emit('draw', data, (response: SocketResponse) => {
        if (response.success) {
          resolve();
        } else {
          reject(new Error(response.error || '그리기 데이터 전송에 실패했습니다.'));
        }
      });
    });
  }

  onDrawingUpdate(callback: (data: DrawingUpdateData) => void) {
    this.socket.on('drawUpdate', callback);
    return () => this.socket.off('drawUpdate', callback);
  }

  startDrawing(roomId: string, initialPoint: DrawingPoint, style: StrokeStyle): Promise<void> {
    const data: DrawingData = {
      roomId,
      points: [initialPoint],
      style,
    };
    return this.sendDrawing(data);
  }

  continueDrawing(roomId: string, newPoints: DrawingPoint[], style: StrokeStyle): Promise<void> {
    const data: DrawingData = {
      roomId,
      points: newPoints,
      style,
    };
    return this.sendDrawing(data);
  }

  fillArea(roomId: string, point: DrawingPoint, color: string): Promise<void> {
    const data: DrawingData = {
      roomId,
      mode: 'fill',
      fillPoint: point,
      fillColor: color,
    };
    return this.sendDrawing(data);
  }

  reportInkUsage(roomId: string, pixelsUsed: number): Promise<void> {
    const data: DrawingData = {
      roomId,
      pixelsUsed,
    };
    return this.sendDrawing(data);
  }

  cleanup() {
    this.socket.off('drawUpdate');
  }
}

export const drawingSocketManager = new DrawingSocketManager();
