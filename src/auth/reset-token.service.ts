import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ResetTokenEntity as ResetToken,
  ResetTokenEntity,
} from './reset-token.entity';
import { MoreThan, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ResetTokenService {
  constructor(
    @InjectRepository(ResetToken)
    private readonly resetTokenRepository: Repository<ResetToken>,
    private readonly configService: ConfigService,
  ) {}

  async create(user_id: number, token: string): Promise<void> {
    const expiredAfterMinutes = Number(
      this.configService.get('RESET_TOKEN_EXPIRY'),
    );
    const expires_in = new Date();
    expires_in.setMinutes(expires_in.getMinutes() + expiredAfterMinutes);

    await this.resetTokenRepository.save({ token, user_id, expires_in });
  }

  async getToken(user_id: number): Promise<ResetToken | null> {
    return await this.resetTokenRepository.findOne({
      where: { user_id, expires_in: MoreThan(new Date()) },
    });
  }

  async findOne(token: string): Promise<ResetToken | null> {
    return await this.resetTokenRepository.findOne({
      where: { token, expires_in: MoreThan(new Date()) },
    });
  }
}
