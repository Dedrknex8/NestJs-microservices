import { NestFactory } from '@nestjs/core';
import { FileModule } from './file/file.module';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule,{
    transport : Transport.TCP,
    options : {
      host : 'localhost',
      port: 3003
    }

  });
  await app.listen();
  console.log('File service is [RUNNIG]')
}
bootstrap();
