

import { IsEmail, IsNotEmpty,  IsString, MinLength } from "class-validator";


export class RegisterDto{
    @IsNotEmpty()
    @IsEmail({},{message : "Email is required"})
    email : string
    
    @IsNotEmpty({message : 'username cannot be empty'})
    @IsString({message : 'username cannot be more than 15 characters long'})
    username: string

    @IsNotEmpty({message : "Password cannot be empty"})
    @IsString({message: 'Password must be a string'})
    password:string


}