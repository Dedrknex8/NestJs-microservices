import { IsOptional, IsString, MaxLength } from "class-validator";


export class UserFileUploadDTO{
    @IsOptional()
    @IsString()
    @MaxLength(50)
    description ?:string;

    userId: string;
    username: string;


    
}