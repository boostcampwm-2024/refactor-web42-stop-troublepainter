import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameException } from '../exceptions/game.exception';

@Catch()
export class WsExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<Socket>();

    if (exception instanceof GameException) {
      client.emit('error', {
        code: exception.code,
        message: exception.message,
      });
    } else {
      client.emit('error', {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
      });
    }

    console.error('WebSocket Error:', exception);
  }
}