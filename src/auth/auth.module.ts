import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenEntity } from './refresh_token.entity';
import { RefreshTokenService } from './refresh-token-service';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([RefreshTokenEntity])],
  controllers: [AuthController],
  providers: [AuthService, RefreshTokenService]
})
export class AuthModule {}
