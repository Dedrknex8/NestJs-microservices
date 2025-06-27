import { NestFactory } from '@nestjs/core';
import { FileModule } from './file/file.module';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule,{
    transport : Transport.TCP,
    options : {
      host : 'localhost',
      port: 3003
    }
  });
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })); //this is a validation pipe check if meta data recived a/q to DTO
  await app.listen();
  console.log('File service is [RUNNIG]')
}
bootstrap();
