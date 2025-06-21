import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportModule,PassportStrategy } from "@nestjs/passport";
import { ExtractJwt,Strategy } from "passport-jwt";
import { AuthService } from "src/auth/auth.service";


@Injectable()
export class JwtStartergy extends PassportStrategy(Strategy){ 
    constructor(
        private authService:AuthService,
        private configservice:ConfigService){
        super({
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration : false,
            secretOrKey: configservice.getOrThrow<string>('JWT_SECRET')
        });
    }

    async validate(payload:any){
        try {
            const user = await this.authService.findUserById(payload)
           
            return {
                ...user,
                roke : user.role
            }
        } catch (error) {
            throw new UnauthorizedException('Invalid-Token')
        }
    }
}