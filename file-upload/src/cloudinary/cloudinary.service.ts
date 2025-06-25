import { Inject, Injectable } from "@nestjs/common";
import { rejects } from "assert";
import { UploadApiResponse } from "cloudinary";
import { resolve } from "path";
import * as streamifier from 'streamifier'
@Injectable()
export class CloudinaryService{
    constructor(
        @Inject('CLOUDINARY')
        private readonly cloudinary : any
    ){}

    uploadFile(file : Express.Multer.File): Promise<UploadApiResponse>{
        return new Promise<UploadApiResponse>((resolve,reject)=>{
            const uplaodStream = this.cloudinary.uploader.upload_stream({
                folder: 'nestJs-fileuplaoder',
                resource_type : 'auto'
            },
            (error : UploadApiResponse, result : UploadApiResponse) =>{
                if (error) reject(error);
                resolve(result);
            }
        );
        //THIS WILL CONVERT THE BUIFFER TO A READABLE STREAM AND PIPE IT TO UPLOAD STREAM
        streamifier.createReadStream(file.buffer).pipe(uplaodStream)
        })
    }

    async deleteFile(publicId : string) : Promise<any>{
        return this.cloudinary.uploader.destroy(publicId)
    }
}