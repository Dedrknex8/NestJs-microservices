import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Role, UserEntity as User} from './Entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bycrpt from 'bcrypt'
import { RegisterDto } from './DTO/user.register.dto';
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
        const hashedPassword = await bycrpt.hash(registerDto.password,10)

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
}
