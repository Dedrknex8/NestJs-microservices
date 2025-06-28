import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
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

  @MessagePattern({cmd:'get-all-file'})
  async getAllFile(@Payload()userId:string){
    return this.fileService.getAllFile(userId);
  }

  @MessagePattern({cmd : 'delete-file'})
  async deleteFile(@Payload()data:{id : number , userId:string}){
    return this.fileService.removeFile(data)
  }

}
