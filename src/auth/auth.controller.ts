import { Body, Controller, HttpCode, HttpStatus, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/user/dto/user-dto';
import { signInDto } from './dto/signIn-dto';
import { refreshTokenDto } from './dto/refresh-token-dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}
    
    @Post('signup')
    signup(@Body() body: UserDto){
        return this.authService.signUp(body);
    }

    @Post('login')
    login(@Body() body: signInDto){
        return this.authService.login(body);
    }

    @Post('refresh')
    refreshToken(@Body() body: refreshTokenDto){
        return this.authService.getTokenFromRefreshToken(body);
    }
}
