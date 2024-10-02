import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { RefreshTokenEntity as RefreshToken } from './refresh_token.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly configService: ConfigService,
  ) {}

  async create(token: string, user_id: number): Promise<void> {
    const expiredAfterDays = Number(
      this.configService.get('REFRESH_TOKEN_EXPIRY'),
    );
    const expires_in = new Date();
    expires_in.setDate(expires_in.getDate() + expiredAfterDays);

    await this.refreshTokenRepository.save({ token, user_id, expires_in });
  }

  async getRefreshTokenFromUserId(
    userId: number,
  ): Promise<RefreshToken | null> {
    return await this.refreshTokenRepository.findOne({
      where: {
        user_id: userId,
        expires_in: MoreThan(new Date()),
      },
    });
  }

  async getRefreshTokenFromToken(token: string): Promise<RefreshToken | null> {
    return await this.refreshTokenRepository.findOne({
      where: {
        token: token,
        expires_in: MoreThan(new Date()),
      },
    });
  }
}
