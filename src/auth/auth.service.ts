import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDto } from 'src/user/dto/user-dto';
import { UserService } from 'src/user/user.service';
import { signInDto } from './dto/signIn-dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { refreshTokenDto } from './dto/refresh-token-dto';
import { RefreshTokenService } from './refresh-token-service';
import { changePasswordDto } from './dto/change-password.dto';
import { forgotPasswordDto } from './dto/forgot-password.dto';
import { ResetTokenService } from './reset-token.service';
import { nanoid } from 'nanoid';
import { MailService } from 'src/services/mail.service';
import { resetPasswordDto } from './dto/reset-password.dto';
import { UserEntity as User } from 'src/user/user.entity';
import { ErrorEnum } from '../utils/constants/error-constant-enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly resetTokeService: ResetTokenService,
    private readonly mailService: MailService,
  ) {}

  async signUp(data: UserDto): Promise<any> {
    const { username, email, password } = data;

    const user = await this.userService.findByEmail(email, [
      'id',
      'email',
      'password',
    ]);

    if (user) {
      throw new BadRequestException(ErrorEnum.EMAIL_ALREADY_EXISTS);
    }

    data.password = await this.hashPassword(password);
    await this.userService.create(data);
    return { result: "Congratulations you're successfully signup!!" };
  }

  async login(data: signInDto): Promise<any> {
    const { email, password } = data;

    const user = await this.userService.findByEmail(email, [
      'id',
      'email',
      'password',
      'username',
    ]);

    if (!user) {
      throw new UnauthorizedException(ErrorEnum.WRONG_CREDENTIALS);
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException(ErrorEnum.WRONG_CREDENTIALS);
    }

    return this.generateToken(user.id, user.username);
  }

  async changePassword(
    data: changePasswordDto,
    userId: number,
  ): Promise<User | null> {
    if (!userId) {
      throw new BadRequestException(ErrorEnum.DATA_MISSING);
    }
    const user = await this.userService.findById(userId, ['password']);

    if (!user) {
      throw new UnauthorizedException(ErrorEnum.WRONG_CREDENTIALS);
    }

    const isPasswordMatched = await bcrypt.compare(
      data.oldPassword,
      user.password,
    );

    if (!isPasswordMatched) {
      throw new UnauthorizedException(ErrorEnum.WRONG_CREDENTIALS);
    }

    //hash new password
    const newHashedPassword = await this.hashPassword(data.newPassword);
    return await this.userService.updatePassword(userId, newHashedPassword);
  }

  async forgotPassword(data: forgotPasswordDto): Promise<any> {
    const user = await this.userService.findByEmail(data.email);

    if (user) {
      const token = nanoid(64);
      await this.resetTokeService.create(user.id, token);

      //send email
      this.mailService.sendPasswordResetEmail(data.email, token);
    }

    return { result: 'Please check your email for password reset link' };
  }

  async resetPassword(data: resetPasswordDto): Promise<User | null> {
    //check valid token
    const validToken = await this.resetTokeService.findOne(data.token);

    if (!validToken) {
      throw new UnauthorizedException(ErrorEnum.INVALID_LINK);
    }

    //check valid user
    const user = await this.userService.findById(validToken.user_id);

    if (!user) {
      throw new InternalServerErrorException();
    }

    //change password
    const hashedPassword = await this.hashPassword(data.newPassword);
    return await this.userService.updatePassword(
      validToken.user_id,
      hashedPassword,
    );
  }

  async getTokenFromRefreshToken(refTokenDto: refreshTokenDto): Promise<any> {
    const refToken = refTokenDto.token;

    const result =
      await this.refreshTokenService.getRefreshTokenFromToken(refToken);

    if (!result) {
      throw new UnauthorizedException(ErrorEnum.INVALID_TOKEN);
    }

    const user = await this.userService.findById(result.user_id);

    return this.generateToken(user.id, user.username);
  }

  private async generateToken(userId: number, userName: string) {
    const acessToken = this.jwtService.sign({ userName, userId });

    // Find token that haven't expired
    const dbRefToken =
      await this.refreshTokenService.getRefreshTokenFromUserId(userId);

    if (dbRefToken != null) {
      return { acessToken, refreshToken: dbRefToken.token };
    }

    const refreshToken = uuidv4();
    await this.refreshTokenService.create(refreshToken, userId);

    return { acessToken, refreshToken };
  }

  private async hashPassword(password: string) {
    const saltRounds: number = Number(this.configService.get('SALT_ROUNDS'));
    return await bcrypt.hash(password, saltRounds);
  }
}
