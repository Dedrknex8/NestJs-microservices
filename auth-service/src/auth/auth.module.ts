import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {JwtModule, JwtService} from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStartergy } from './stratergies/jwt.stratergy';
import { UserEntity } from './Entities/user.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
     JwtModule.registerAsync({
      imports : [ConfigModule],
      useFactory : async(configService: ConfigService)=>({
        secret : configService.getOrThrow('JWT_SECRET'),
        signOptions: {expiresIn: '15m'}
      }),
       inject: [ConfigService]
    }),
    ConfigModule,
    
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStartergy,],
  exports : [AuthService,]
})
export class AuthModule {}
