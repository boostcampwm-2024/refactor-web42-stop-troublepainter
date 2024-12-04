import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: '*',
    methods: '*',
  });

  const httpServer = app.getHttpServer();
  const ioAdapter = new IoAdapter(httpServer);
  app.useWebSocketAdapter(ioAdapter);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
