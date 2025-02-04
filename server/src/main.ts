import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdaptor } from './redis/redis.adaptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: '*',
    methods: '*',
  });

  const redisIoAdapter = new RedisIoAdaptor(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
