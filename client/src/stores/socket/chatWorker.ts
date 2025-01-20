// chatWorker.ts
import { SocketNamespace } from '@/stores/socket/socket.config';

interface ChatAuth {
  roomId: string;
  playerId: string;
}

class WorkerManager {
  private static instance: WorkerManager;
  private worker: SharedWorker | null = null;
  private messageHandlers: Set<(e: MessageEvent) => void> = new Set();
  private connected: boolean = false;
  private auth: ChatAuth | null = null;

  private constructor() {
    console.log('Initializing WorkerManager...');
    try {
      this.worker = new SharedWorker(new URL('./socketWorker.ts', import.meta.url), {
        type: 'module',
        name: 'socket-worker',
      });

      this.messageHandlers = new Set();
      this.setupWorkerListeners();
      this.worker.port.start();
    } catch (error) {
      console.error('Error initializing WorkerManager:', error);
    }
  }

  private setupWorkerListeners() {
    if (!this.worker) return;
    this.worker.port.onmessage = (e) => {
      const { type, namespace, connected, event, args } = e.data;

      switch (type) {
        case 'init':
          console.log('초기 연결 상태:', e.data.connected);
          this.connected = e.data.connected.chat;
          break;
        case 'connection_update':
          console.log(`${namespace} 연결 상태 변경:`, connected);
          if (namespace === SocketNamespace.CHAT) {
            this.connected = connected;
          }
          break;
        case 'socket_event':
          if (event === 'messageReceived') {
            console.log('메시지 수신:', args[0]);
          }
          break;
        case 'socket_error':
          console.error(`${namespace} 에러 발생:`, e.data.error);
          break;
      }

      this.messageHandlers.forEach((handler) => handler(e));
    };
  }

  public static getInstance(): WorkerManager {
    if (!WorkerManager.instance) {
      WorkerManager.instance = new WorkerManager();
    }
    return WorkerManager.instance;
  }

  public connect(auth: ChatAuth) {
    if (!this.worker) {
      console.error('Worker not initialized');
      return;
    }
    console.log('Connecting to chat socket with auth:', auth);
    this.auth = auth;

    this.worker.port.postMessage({
      type: 'connect',
      payload: {
        namespace: SocketNamespace.CHAT,
        auth: {
          roomId: auth.roomId,
          playerId: auth.playerId,
        },
      },
    });
  }

  public sendChatMessage(message: string) {
    if (!this.worker) {
      console.error('Worker not initialized');
      return;
    }

    if (!this.connected || !this.auth) {
      console.warn('Chat is not connected or auth is missing');
      return;
    }

    console.log('Sending chat message:', message);
    this.worker.port.postMessage({
      type: 'emit',
      payload: {
        namespace: SocketNamespace.CHAT,
        event: 'sendMessage',
        args: [{ message: message.trim() }],
      },
    });
  }

  public disconnect() {
    if (!this.worker) return;
    console.log('Disconnecting from chat...');
    this.worker.port.postMessage({
      type: 'disconnect',
      payload: {
        namespace: SocketNamespace.CHAT,
      },
    });
    this.connected = false;
    this.auth = null;
  }

  public addMessageHandler(handler: (e: MessageEvent) => void) {
    this.messageHandlers.add(handler);
  }

  public removeMessageHandler(handler: (e: MessageEvent) => void) {
    this.messageHandlers.delete(handler);
  }
}

export const workerManager = WorkerManager.getInstance();

export const connectChat = (auth: ChatAuth) => workerManager.connect(auth);
export const sendChatMessage = (message: string) => workerManager.sendChatMessage(message);
export const addMessageHandler = (handler: (e: MessageEvent) => void) => workerManager.addMessageHandler(handler);
export const removeMessageHandler = (handler: (e: MessageEvent) => void) => workerManager.removeMessageHandler(handler);
export const disconnectChat = () => workerManager.disconnect();
