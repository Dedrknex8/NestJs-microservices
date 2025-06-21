import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {JwtModule, JwtService} from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStratergy } from './stratergies/jwt.stratergy';
import { UserEntity } from './Entities/user.entity';
@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    TypeOrmModule.forFeature([UserEntity]),
     JwtModule.registerAsync({
      imports : [ConfigModule],
      useFactory : async(configService: ConfigService)=>({
        secret : process.env.JWT_SECRET,
        signOptions: {expiresIn: '15m'}
      })
    }),
    ConfigModule,
    
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStratergy,],
  exports : [AuthService,]
})
export class AuthModule {}
