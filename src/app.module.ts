import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './stratergies/jwt.stratergy';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MulterModule } from '@nestjs/platform-express';
import {memoryStorage} from 'multer'
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      isGlobal:true,
      useFactory : ()=>({
        stores : redisStore,
        host: 'localhost',
        port : 6379,
        ttl : 120 , //TIME IN SECONDS
      })
    }),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // or use ConfigService
      signOptions: { expiresIn: '15m' },
    }),
    CloudinaryModule,
        MulterModule.register({
          storage : memoryStorage()
        }),
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001,
        },
      },
      {
        name: 'Service_Post',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3002,
        },
      },
      {
        name : 'FILE_SERVICE',
        options : {
          host : 'localhost',
          port : 3003
        }
      }
    ]),
  ],
  controllers: [AppController],
  providers: [AppService,JwtStrategy],
})
export class AppModule {}
