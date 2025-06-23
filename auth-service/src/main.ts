import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); 
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3001, 
    },
  });

  await app.startAllMicroservices();
  await app.listen(3003)
  console.log('Auth microservice is running on http:port 3003');
}
bootstrap();
