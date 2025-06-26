import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FileService } from './file.service';
import { UserFileUploadDTO } from '../DTO/user-fileUplaod.dto';

@Controller()
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @MessagePattern({ cmd: 'save-file' })
    async saveFile(@Payload() data: UserFileUploadDTO) {
    return this.fileService.saveFileMetadata(data);
    }

  @MessagePattern({cmd: 'get-file-by-id'})
  async getfilebyid(id:number){
    return this.fileService.findFileById(id)
  }

}
