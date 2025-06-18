import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal : true
    }),
    TypeOrmModule.forRoot({
      type : 'postgres',
      host : 'localhost',
      port : 5432 ,
      username  : 'postgress',
      password  :'root',
      database : ''
    }),
    ClientsModule.register([
      {
        name : 'Service_A',
        transport : Transport.TCP,
        options : {
          host : 'localhost',
          port : 3001,
        },
      },
      {
        name : 'Service_B',
        transport : Transport.TCP,
        options : {
          host : 'localhost',
          port : 3002
        }
      }

    ])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
