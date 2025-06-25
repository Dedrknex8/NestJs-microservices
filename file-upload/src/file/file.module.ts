import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule, } from '../cloudinary/cloudinary.module';
import { MulterModule } from '@nestjs/platform-express';
import {memoryStorage} from 'multer'
import { File } from '../Entites/file-uplaod.entities';
import { ClientsModule, Transport } from '@nestjs/microservices';
@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    CloudinaryModule,
    MulterModule.register({
      storage : memoryStorage()
    }),
    ClientsModule.register([
      {
        name : 'AUTH_SERVICE',
        transport : Transport.TCP,
        options : {
          host : 'localhost',
          port : 3001
        }
      },
      {
        name : 'Post_Service',
        transport : Transport.TCP,
        options : {
          host : 'localhost',
          port : 3002
        }
      },
    ]),
    
  ],
  providers: [FileService],
  controllers: [FileController]
})
export class FileModule {}
