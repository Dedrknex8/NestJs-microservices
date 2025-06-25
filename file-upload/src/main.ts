import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FileModule } from './file/file.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(FileModule,{
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
