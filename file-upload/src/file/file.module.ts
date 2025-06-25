import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule, } from '../cloudinary/cloudinary.module';
import { MulterModule } from '@nestjs/platform-express';
import {memoryStorage} from 'multer'
import { File } from '../Entites/file-uplaod.entities';
@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    CloudinaryModule,
    MulterModule.register({
      storage : memoryStorage()
    }),
    
  ],
  providers: [FileService],
  controllers: [FileController]
})
export class FileModule {}
