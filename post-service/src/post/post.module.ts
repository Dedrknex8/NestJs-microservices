import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from 'src/Entity/post.enity';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports : [
    TypeOrmModule.forFeature([PostEntity]),
    ClientsModule.register([
      {
        name : 'Auth_Service',
        transport : Transport.TCP,
        options : {
          host : 'localhost',
          port : 3001
        }
      }
    ])
  ],
  providers: [PostService],
  controllers: [PostController]
})
export class PostModule {}
