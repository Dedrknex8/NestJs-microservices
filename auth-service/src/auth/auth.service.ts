import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Role, UserEntity as User} from './Entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private  configService : ConfigService,
        private userRep : Repository<User>,
        private jwtService : JwtService
    ){}

    async registerUser(registerDto : any){
        const userExists = await this.userRep.findOne({
            where : {email : registerDto.email}
        })

        if(userExists){
            throw new ConflictException('User alreay exist. Please try again with different email');
        }

        //hash the passwd
        const hashedPassword = await bcrypt.hash

        // return the save user deatils wid removing of passwd
        const createNewUser = await this.userRep.create({
            email  : registerDto.email,
            username : registerDto.username,
            password  : hashedPassword,
            role : Role.User
        })
    }
}
