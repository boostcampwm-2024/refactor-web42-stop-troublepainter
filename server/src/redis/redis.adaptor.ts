import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { ServerOptions } from 'socket.io';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';

export class RedisIoAdaptor extends IoAdapter {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  private adapterConstructor: ReturnType<typeof createAdapter>;

  async connectToRedis(): Promise<void> {
    const host = this.configService.get('REDIS_HOST') || '127.0.0.1';
    const port = parseInt(this.configService.get('REDIS_PORT')) || 6379;

    const pubClient = createClient({
      socket: { host, port },
    });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIoServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
