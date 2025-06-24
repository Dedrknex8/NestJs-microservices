import { Module } from "@nestjs/common";
import {CloudinaryService} from './user-fileUpload.cloudinary.service'
import { cloudinaryProvider } from "./user-fileUpload.cloudinary.provider";

@Module({
    providers : [
        CloudinaryService,
        cloudinaryProvider
    ],
    exports : [CloudinaryService]
})

export class cloudinaryModule{}