import { SocketNamespace } from '@/stores/socket/socket.config';
import {
  CheckAnswerRequest,
  CRDTSyncMessage,
  JoinRoomRequest,
  JoinRoomResponse,
  PlayerLeftResponse,
  ReconnectRequest,
  RoomEndResponse,
  RoundEndResponse,
  RoundStartResponse,
  TimerSyncResponse,
  UpdateSettingsRequest,
  UpdateSettingsResponse,
} from '@troublepainter/core';

type GameEventMap = {
  joinedRoom: (response: JoinRoomResponse) => void;
  playerJoined: (response: JoinRoomResponse) => void;
  playerLeft: (response: PlayerLeftResponse) => void;
  settingsUpdated: (response: UpdateSettingsResponse) => void;
  drawingGroupRoundStarted: (response: RoundStartResponse) => void;
  guesserRoundStarted: (response: RoundStartResponse) => void;
  timerSync: (response: TimerSyncResponse) => void;
  drawingTimeEnded: () => void;
  roundEnded: (response: RoundEndResponse) => void;
  gameEnded: (response: RoomEndResponse) => void;
};

type WaitingQueueType = {
  event: string;
  args: any[];
};

class GameWorkerManager {
  private static instance: GameWorkerManager;
  private worker: SharedWorker | null = null;
  private connected: boolean = false;
  private waitingQueue: WaitingQueueType[] = [];
  private eventHandlers: Map<keyof GameEventMap, Set<Function>> = new Map();
  private constructor() {
    try {
      this.worker = new SharedWorker(new URL('./socketWorker.ts', import.meta.url), {
        type: 'module',
        name: 'socket-worker',
      });

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

      // GAME 네임스페이스 이벤트만 처리
      if (type === 'connection_update' || type === 'socket_event' || type === 'socket_error') {
        if (namespace !== SocketNamespace.GAME) return;
      }

      switch (type) {
        case 'init':
          this.connected = e.data.connected[SocketNamespace.GAME] || false;
          break;
        case 'connection_update':
          this.connected = connected;
          if (this.connected && this.waitingQueue.length) {
            this.waitingQueue.forEach((v) => {
              this.emitEvent(v.event, ...v.args);
            });
          }
          break;
        case 'socket_event':
          const handlers = this.eventHandlers.get(event as keyof GameEventMap);
          if (handlers) {
            handlers.forEach((handler) => handler(...args));
          }
          break;
        case 'socket_error':
          console.error('Game socket error:', e.data.error);
          break;
      }
    };
  }

  public static getInstance(): GameWorkerManager {
    if (!GameWorkerManager.instance) {
      GameWorkerManager.instance = new GameWorkerManager();
    }
    return GameWorkerManager.instance;
  }

  // 이벤트 리스너 등록 메서드
  public on<T extends keyof GameEventMap>(event: T, handler: GameEventMap[T]) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);
  }

  // 이벤트 리스너 제거 메서드
  public off<T extends keyof GameEventMap>(event: T, handler: GameEventMap[T]) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  public connect() {
    if (!this.worker) {
      console.error('Game Worker not initialized');
      return;
    }

    this.worker.port.postMessage({
      type: 'connect',
      payload: {
        namespace: SocketNamespace.GAME,
      },
    });
  }

  public disconnect() {
    if (!this.worker) return;
    if (this.waitingQueue.length) {
      this.waitingQueue = [];
    }
    this.worker.port.postMessage({
      type: 'disconnect',
      payload: {
        namespace: SocketNamespace.GAME,
      },
    });
    this.connected = false;
  }

  // Event handling
  private emitEvent(event: string, ...args: any[]) {
    if (!this.worker) {
      console.error('Worker not initialized');
      return;
    }

    if (!this.connected) {
      console.warn('Game socket is not connected');
      this.waitingQueue.push({ event, args });
      return;
    }

    this.worker.port.postMessage({
      type: 'emit',
      payload: {
        namespace: SocketNamespace.GAME,
        event,
        args,
      },
    });
  }

  public joinRoom(request: JoinRoomRequest) {
    this.emitEvent('joinRoom', request);
  }

  public reconnectRoom(request: ReconnectRequest) {
    this.emitEvent('reconnect', request);
  }

  public updateSetting(request: UpdateSettingsRequest) {
    this.emitEvent('updateSettings', request);
  }

  public gameStart() {
    this.emitEvent('gameStart');
  }

  public checkAnswer(request: CheckAnswerRequest) {
    this.emitEvent('checkAnswer', request);
  }

  public submittedDrawing(drawing: CRDTSyncMessage) {
    this.emitEvent('submittedDrawing', { drawing });
  }

  public isConnected() {
    return this.connected;
  }
}

export const gameWorkerManager = GameWorkerManager.getInstance();
export const onGameEvent = <T extends keyof GameEventMap>(event: T, handler: GameEventMap[T]) =>
  gameWorkerManager.on(event, handler);
export const offGameEvent = <T extends keyof GameEventMap>(event: T, handler: GameEventMap[T]) =>
  gameWorkerManager.off(event, handler);
export const gameSocketConnect = () => gameWorkerManager.connect();
export const gameSocketDisconnect = () => gameWorkerManager.disconnect();
export const gameWorkerJoinRoom = (request: JoinRoomRequest) => gameWorkerManager.joinRoom(request);
export const gameWorkerReconnectRoom = (request: ReconnectRequest) => gameWorkerManager.reconnectRoom(request);
export const gameWorkerUpdateSetting = (request: UpdateSettingsRequest) => gameWorkerManager.updateSetting(request);
export const gameWorkerGameStart = () => gameWorkerManager.gameStart();
export const gameWorkerCheckAnswer = (request: CheckAnswerRequest) => gameWorkerManager.checkAnswer(request);
export const gameWorkerSubmitDrawing = (drawing: CRDTSyncMessage) => gameWorkerManager.submittedDrawing(drawing);
export const gameSocketIsConnected = () => gameWorkerManager.isConnected();
