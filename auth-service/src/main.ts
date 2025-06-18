import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule,{
    transport : Transport.TCP,
    options : {
      host : 'localhost',
      port : 3001
    }
  });
  await app.listen();
  console.log('Application is running on port 3001')
}
bootstrap();
