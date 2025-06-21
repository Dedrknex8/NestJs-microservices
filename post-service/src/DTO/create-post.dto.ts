import { IsNotEmpty, IsString, MinLength } from "class-validator";


export class CreatePostDto{


    @IsNotEmpty({message : "title is required"})
    @IsString({message : "Titile must be a string"})
    @MinLength(3, {message : "title must be of 3 Characters long" })
    title : string
    
    @IsNotEmpty({message : "Content can't be empty"})
    @IsString({message : "Content must be a string"})
    @MinLength(3, {message : "Content must be of 3 Characters long" })
    content : string

    // @IsNotEmpty({message : "authorname can't be empty"})
    // @IsString({message : "authorname must be a string"})
    // @MinLength(3, {message : "authorname must be of 3 Characters long" })
    // authorname : string
}