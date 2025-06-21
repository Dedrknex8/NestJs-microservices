import { Injectable, UnauthorizedException } from "@nestjs/common";
import {  PassportStrategy } from "@nestjs/passport";
import {ExtractJwt, Strategy} from 'passport-jwt'
import { AuthService } from "../auth.service";
import { ConfigService } from "@nestjs/config";
@Injectable()
export class JwtStratergy extends PassportStrategy(Strategy){
    constructor(private authservice : AuthService,private ConfigService : ConfigService){
        super({
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration : false,
            secretOrKey : ConfigService.getOrThrow<string>('JWT_SECRET')
        });
    }

    async validate(payload  : any) {
        try {

            const user = await this.authservice.findUserById(payload.id);
            
            return {
                ...user,
                role : user.role //this will get us role and will verify this role to check if admin or not
            }
        } catch (error) {
            throw new UnauthorizedException('Invalid Token')
        }
    }
}