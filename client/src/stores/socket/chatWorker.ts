// chatWorker.ts
import { SocketNamespace } from '@/stores/socket/socket.config';

interface ChatAuth {
  roomId: string;
  playerId: string;
}

class ChatWorkerManager {
  private static instance: ChatWorkerManager;
  private worker: SharedWorker | null = null;
  private messageHandlers: Set<(e: MessageEvent) => void> = new Set();
  private connected: boolean = false;
  private auth: ChatAuth | null = null;

  private constructor() {
    console.log('Initializing ChatWorkerManager...');
    try {
      this.worker = new SharedWorker(new URL('./socketWorker.ts', import.meta.url), {
        type: 'module',
        name: 'socket-worker',
      });

      this.messageHandlers = new Set();
      this.setupWorkerListeners();
      this.worker.port.start();
    } catch (error) {
      console.error('Error initializing ChatWorkerManager:', error);
    }
  }

  private setupWorkerListeners() {
    if (!this.worker) return;
    this.worker.port.onmessage = (e) => {
      const { type, namespace, connected, event, args } = e.data;

      // CHAT 네임스페이스 이벤트만 처리
      if (type === 'connection_update' || type === 'socket_event' || type === 'socket_error') {
        if (namespace !== SocketNamespace.CHAT) return;
      }

      switch (type) {
        case 'init':
          this.connected = e.data.connected[SocketNamespace.CHAT] || false;
          break;
        case 'connection_update':
          console.log('Chat connection status:', connected);
          this.connected = connected;
          break;
        case 'socket_event':
          if (event === 'messageReceived') {
            console.log('Chat message received:', args[0]);
          }
          break;
        case 'socket_error':
          console.error('Chat socket error:', e.data.error);
          break;
      }

      this.messageHandlers.forEach((handler) => handler(e));
    };
  }

  public static getInstance(): ChatWorkerManager {
    if (!ChatWorkerManager.instance) {
      ChatWorkerManager.instance = new ChatWorkerManager();
    }
    return ChatWorkerManager.instance;
  }

  public connect(auth: ChatAuth) {
    if (!this.worker) {
      console.error('Worker not initialized');
      return;
    }

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

export const chatWorkerManager = ChatWorkerManager.getInstance();

export const connectChat = (auth: ChatAuth) => chatWorkerManager.connect(auth);
export const sendChatMessage = (message: string) => chatWorkerManager.sendChatMessage(message);
export const addMessageHandler = (handler: (e: MessageEvent) => void) => chatWorkerManager.addMessageHandler(handler);
export const removeMessageHandler = (handler: (e: MessageEvent) => void) =>
  chatWorkerManager.removeMessageHandler(handler);
export const disconnectChat = () => chatWorkerManager.disconnect();
