import {
  ChatClientEvents,
  ChatServerEvents,
  DrawingClientEvents,
  DrawingServerEvents,
  GameClientEvents,
  GameServerEvents,
} from '@troublepainter/core';
import { Socket } from 'socket.io-client';

// 소켓 타입 정의
// ----------------------------------------------------------------------------------------------------------------------
export type GameSocket = Socket<GameServerEvents, GameClientEvents>;
export type DrawingSocket = Socket<DrawingServerEvents, DrawingClientEvents>;
export type ChatSocket = Socket<ChatServerEvents, ChatClientEvents>;
