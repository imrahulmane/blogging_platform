import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/user/dto/user-dto';
import { signInDto } from './dto/signIn-dto';
import { refreshTokenDto } from './dto/refresh-token-dto';
import { changePasswordDto } from './dto/change-password.dto';
import { forgotPasswordDto } from './dto/forgot-password.dto';
import { resetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: UserDto) {
    return this.authService.signUp(body);
  }

  @Post('login')
  login(@Body() body: signInDto) {
    return this.authService.login(body);
  }

  @Post('refresh')
  refreshToken(@Body() body: refreshTokenDto) {
    return this.authService.getTokenFromRefreshToken(body);
  }

  @Put('change-password')
  changePassword(@Body() changePasswordDto: changePasswordDto, @Req() req) {
    return this.authService.changePassword(changePasswordDto, req.userId);
  }

  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: forgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: resetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
