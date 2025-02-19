import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdaptor } from './redis/redis.adaptor';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: '*',
    methods: '*',
  });

  // const ioAdapter = new IoAdapter(app);
  // app.useWebSocketAdapter(ioAdapter);

  const httpServer = app.getHttpServer();
  const config = app.get(ConfigService);

  const redisIoAdapter = new RedisIoAdaptor(httpServer, config);
  await redisIoAdapter.connectToRedis();

  app.useWebSocketAdapter(redisIoAdapter);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
