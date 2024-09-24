import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenEntity } from './refresh_token.entity';
import { RefreshTokenService } from './refresh-token-service';
import { ResetTokenService } from './reset-token.service';
import { ResetTokenEntity } from './reset-token.entity';
import { MailService } from 'src/services/mail.service';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([RefreshTokenEntity, ResetTokenEntity])],
  controllers: [AuthController],
  providers: [AuthService, RefreshTokenService, ResetTokenService, MailService]
})
export class AuthModule {}
