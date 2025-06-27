import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UserFileUploadDTO } from '../DTO/user-fileUplaod.dto';
import {File } from '../Entites/file-uplaod.entities';
import { Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';

@Injectable()
export class FileService {
    constructor(
        @InjectRepository(File)
        private readonly fileRepo : Repository<File>,
        private readonly  cloudinaryService : CloudinaryService,
    ){}
    //  async uploadFile(file : Express.Multer.File,meta: UserFileUploadDTO) : Promise<File>{
    //     const cloudinaryReponse = await this.cloudinaryService.uploadFile(file);

    //     const newnlyCreatedFile = this.fileRepo.create({
    //         originalName : file.originalname,
    //         mimeType : file.mimetype,
    //         size : file.size,
    //         publicId :  cloudinaryReponse?.public_id,
    //         url : cloudinaryReponse?.secure_url,
    //         description:meta.description,
    //         userId:meta.userId,
    //         username : meta.username
    //     });

    //     return this.fileRepo.save(newnlyCreatedFile);
    // }
    async saveFileMetadata(data: UserFileUploadDTO) {
    const file = this.fileRepo.create(data);
    return this.fileRepo.save(file);
    }

    async findFileById(id:number){
        const file = await this.fileRepo.findOne({
            where: { id }
        });

        if(!file){
            throw new NotFoundError(`file with this id ${id} is not found`)
        }

        return file
    }

    async getAllFile(userId:string){
        console.log("ypur user id is :",userId)
        return  await this.fileRepo.find({
            where : {userId: userId.toString() },
            order : {created_At: 'DESC'}
        })
    }

}
