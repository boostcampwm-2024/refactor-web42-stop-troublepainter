import { io, Socket } from 'socket.io-client';
import { SocketError } from '@troublepainter/core';
import { SocketNamespace, SocketAuth, SOCKET_CONFIG, SocketType } from '@/stores/socket/socket.config';
import type { GameSocket, DrawingSocket, ChatSocket } from '@/types/socket.types';

// type NamespaceSocketMap = {
//   game: GameSocket;
//   drawing: DrawingSocket;
//   chat: ChatSocket;
// };

class SocketManager {
  private sockets: Map<SocketNamespace, Socket>;
  private ports: Set<MessagePort>;
  private connected: Record<SocketNamespace, boolean>;

  constructor() {
    this.sockets = new Map();
    this.ports = new Set();
    this.connected = {
      game: false,
      drawing: false,
      chat: false,
    };
  }

  private createSocket<T extends SocketType>(namespace: SocketNamespace, auth?: SocketAuth): T {
    const options = auth ? { ...SOCKET_CONFIG.BASE_OPTIONS, auth } : SOCKET_CONFIG.BASE_OPTIONS;
    // console.log(`${SOCKET_CONFIG.URL}${SOCKET_CONFIG.PATHS[namespace]}`);
    return io(`${SOCKET_CONFIG.URL}${SOCKET_CONFIG.PATHS[namespace]}`, options) as T;
  }

  private broadcast(message: any) {
    this.ports.forEach((port) => {
      port.postMessage(message);
    });
  }

  private updateConnectionState(namespace: SocketNamespace, isConnected: boolean) {
    this.connected[namespace] = isConnected;
    this.broadcast({
      type: 'connection_update',
      namespace,
      connected: isConnected,
    });
  }

  private setupSocketEvents(socket: Socket, namespace: SocketNamespace) {
    socket.on('connect', () => {
      this.updateConnectionState(namespace, true);
    });

    socket.on('disconnect', () => {
      this.updateConnectionState(namespace, false);
    });

    socket.on('error', (error: SocketError) => {
      this.broadcast({
        type: 'socket_error',
        namespace,
        error,
      });
    });

    socket.onAny((eventName, ...args) => {
      console.log('namespace:', namespace, 'event:', eventName, 'args:', args);
      this.broadcast({
        type: 'socket_event',
        namespace,
        event: eventName,
        args,
      });
    });
  }

  connect(namespace: SocketNamespace, auth?: SocketAuth) {
    const currentSocket = this.sockets.get(namespace);

    if (currentSocket?.connected) return;

    if (currentSocket) {
      currentSocket.disconnect();
      this.sockets.delete(namespace);
    }

    let socket: Socket;

    switch (namespace) {
      case SocketNamespace.GAME:
        socket = this.createSocket<GameSocket>(namespace);
        break;
      case SocketNamespace.DRAWING:
        socket = this.createSocket<DrawingSocket>(namespace, auth);
        break;
      case SocketNamespace.CHAT:
        socket = this.createSocket<ChatSocket>(namespace, auth);
        break;
      default:
        throw new Error(`Unknown namespace: ${namespace}`);
    }

    this.setupSocketEvents(socket, namespace);
    socket.connect();
    this.sockets.set(namespace, socket);
  }

  emit(namespace: SocketNamespace, event: string, ...args: any[]) {
    const socket = this.sockets.get(namespace);
    if (!socket) {
      console.warn(`No socket found for namespace: ${namespace}`);
      return;
    }

    if (!socket.connected) {
      console.warn(`Socket for namespace ${namespace} is not connected`);
      return;
    }
    socket.emit(event, ...args);
  }

  disconnect(namespace: SocketNamespace) {
    const socket = this.sockets.get(namespace);
    if (!socket) return;

    socket.disconnect();
    this.sockets.delete(namespace);
    this.updateConnectionState(namespace, false);
  }

  disconnectAll() {
    Array.from(this.sockets.keys()).forEach((namespace) => {
      this.disconnect(namespace as SocketNamespace);
    });
  }

  addPort(port: MessagePort) {
    this.ports.add(port);
    port.postMessage({
      type: 'init',
      connected: this.connected,
    });
  }

  removePort(port: MessagePort) {
    this.ports.delete(port);
    if (this.ports.size === 0) {
      this.disconnectAll();
    }
  }
}

const manager = new SocketManager();

addEventListener('connect', (e: Event) => {
  const connectEvent = e as MessageEvent;
  const port = connectEvent.ports[0];
  manager.addPort(port);

  port.onmessage = (e: MessageEvent) => {
    const { type, payload } = e.data;
    console.log('shared worker에서 받은 값', type, payload);
    switch (type) {
      case 'connect':
        manager.connect(payload.namespace, payload.auth);
        break;
      case 'disconnect':
        manager.disconnect(payload.namespace);
        break;
      case 'disconnect_all':
        manager.disconnectAll();
        break;
      case 'emit':
        manager.emit(payload.namespace, payload.event, ...payload.args);
        break;
      default:
        console.warn('Unknown message type:', type);
    }
  };

  port.start();
  port.onmessageerror = () => manager.removePort(port);
});
