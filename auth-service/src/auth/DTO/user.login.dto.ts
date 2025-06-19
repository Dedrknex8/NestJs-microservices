

import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";


export class LoginDto{
    @IsNotEmpty()
    @IsEmail({},{message : "Email is required"})
    email : string

    @IsNotEmpty({message : "Password cannot be empty"})
    @IsString({message: 'Password must be a string'})
   
    
    password:string


}