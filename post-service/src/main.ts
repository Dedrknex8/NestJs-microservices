import { NestFactory } from '@nestjs/core';
import { PostModule } from './post/post.module'; // or AppModule if renamed
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(PostModule, {
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3002, 
    },
  });

  await app.listen();
  console.log(' Post Microservice running on port 3002');
}
bootstrap();
