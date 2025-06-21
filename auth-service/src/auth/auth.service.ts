import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Role, UserEntity as User} from './Entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcyrpt from 'bcrypt'
import { RegisterDto } from './DTO/user.register.dto';
import { LoginDto } from './DTO/user.login.dto';
@Injectable()
export class AuthService {
    constructor(
        private  configService : ConfigService,
        private userRep : Repository<User>,
        private jwtService : JwtService
    ){}

    async registerUser(registerDto : RegisterDto) {
        const userExists = await this.userRep.findOne({
            where : {email : registerDto.email}
        })

        if(userExists){
            throw new ConflictException('User alreay exist. Please try again with different email');
        }

        //hash the passwd
        const hashedPassword = await bcyrpt.hash(registerDto.password,10)

        // return the save user deatils wid removing of passwd
        const createNewUser = await this.userRep.create({
            email  : registerDto.email,
            username : registerDto.username,
            password  : hashedPassword,
            role : Role.User
        });

        const savedUser = await this.userRep.save(createNewUser)

        const {password, ...result} = savedUser

        return {
            user : result,
            message : 'user created sucessfully'
        }

    }

    //LOGIN FACILITY WITH TOKEN GENEREATETION
    async loginUser(loginDto : LoginDto) : Promise<{user : any; accessToken : string; refreshToken:string}>{
        //CHECK IF USER EXIST FIRST 
        const user = await this.userRep.findOne({
            where : {email : loginDto.email},
            select  : ['id','email','password','role','username']
        });

        if(!user || !(await this.verifyPassword(loginDto.password,user.password))){
            throw new NotFoundException(`user with this ${loginDto.email} cannot be found, Try with different email id or register new one`);
        }

        //GENEREATE Tokens

       const { accessToken, refreshToken } = await this.generateToken(user);

       const {password, ...safeuser}  = user;

        return {
            user : user,
            accessToken : accessToken,
            refreshToken : refreshToken
        }

    }

    async generateToken(User : User): Promise<{accessToken:string,refreshToken:string}>{

        const accessToken = await this.generateAccessToken(User);
        const refreshToken = await this.generateRefershToken(User);

        return {
            accessToken,
            refreshToken
        }
    }

     async generateAccessToken(User:User) : Promise<string> {
        // this token will consits email,id, role

        const payload = {
            email : User.email,
            id : User.id,
            Role : User.role
        }

        return this.jwtService.sign(payload,{
            secret : this.configService.getOrThrow('JWT_SECRET') ,
            expiresIn : '15m'
        })
    }
    
    async generateRefershToken(User:User) : Promise<string> {
        const payload = {
            id : User.id
        }

        return this.jwtService.sign(payload,{
            secret : this.configService.getOrThrow('JWT_REFRESH_SECRET'),
            expiresIn : '7d'
        })
    }


    async findUserById(userId : number ){
        const getUser = await this.userRep.findOne({
              where : {id :  userId}
        })
        

        if(!getUser){
            throw new NotFoundException('User with this id is not available')
        }

        const {password, ...result} =  getUser;

        return result;
    }

    async verifyPassword(password : string, hashedPassword : string) : Promise<boolean>{
        if(!password || !hashedPassword){
            throw new BadRequestException('password verification failed')
        }

        return await bcyrpt.compare(password,hashedPassword);
    }
}
