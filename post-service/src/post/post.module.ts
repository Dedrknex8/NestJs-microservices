import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from '../Entity/post.enity';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { PostController } from './post.controller';

@Module({
  imports : [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'Microservice', 
      entities: [PostEntity],
      synchronize: true, 
    }),
    TypeOrmModule.forFeature([PostEntity]),
    ClientsModule.register([
      {
        name : 'AUTH_SERVICE',
        transport : Transport.TCP,
        options : {
          host : 'localhost',
          port : 3001
        }
      },
    ])
  ],
  providers: [PostService],
  controllers: [PostController],})
export class PostModule {}
