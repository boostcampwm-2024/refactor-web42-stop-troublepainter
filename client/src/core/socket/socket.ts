import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

class SocketManager {
  private static instance: SocketManager;
  private gameSocket: Socket | null = null;
  private drawingSocket: Socket | null = null;

  private constructor() {}

  static getInstance(): SocketManager {
    if (!this.instance) {
      this.instance = new SocketManager();
    }
    return this.instance;
  }

  initializeSockets() {
    this.gameSocket = io(`${SOCKET_URL}/game`, {
      transports: ['websocket'],
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.drawingSocket = io(`${SOCKET_URL}/drawing`, {
      transports: ['websocket'],
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupErrorHandlers();
  }

  private setupErrorHandlers() {
    const sockets = [this.gameSocket, this.drawingSocket];

    sockets.forEach((socket) => {
      if (!socket) return;

      socket.on('connect_error', (error) => {
        console.error(`Socket connection error: ${error.message}`);
      });

      socket.on('disconnect', (reason) => {
        console.warn(`Socket disconnected: ${reason}`);
      });

      socket.on('reconnect', (attemptNumber) => {
        console.log(`Socket reconnected after ${attemptNumber} attempts`);
      });
    });
  }

  getGameSocket(): Socket {
    if (!this.gameSocket) {
      throw new Error('Game socket not initialized');
    }
    return this.gameSocket;
  }

  getDrawingSocket(): Socket {
    if (!this.drawingSocket) {
      throw new Error('Drawing socket not initialized');
    }
    return this.drawingSocket;
  }

  connectSockets() {
    if (this.gameSocket) this.gameSocket.connect();
    if (this.drawingSocket) this.drawingSocket.connect();
  }

  disconnectSockets() {
    if (this.gameSocket) this.gameSocket.disconnect();
    if (this.drawingSocket) this.drawingSocket.disconnect();
  }
}

export const socketManager = SocketManager.getInstance();
