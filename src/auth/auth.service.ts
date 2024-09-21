import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDto } from 'src/user/dto/user-dto';
import { UserService } from 'src/user/user.service';
import { signInDto } from './dto/signIn-dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { refreshTokenDto } from './dto/refresh-token-dto';
import { RefreshTokenService } from './refresh-token-service';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly refreshTokenService: RefreshTokenService){}

    async signUp(data: UserDto): Promise<any> {
        const {username, email, password} = data;

        const user = await this.userService.findByEmail(email);
        
        if(user){
            throw new BadRequestException("Email already in use");
        }       

        const saltRounds: number = Number(this.configService.get('SALT_ROUNDS'));
        const hashedPassword: string = await bcrypt.hash(password, saltRounds);
      
        data.password  = hashedPassword;

        const result = await this.userService.create(data);

        return {result : "Congratulations you're successfully signup!!"}
    }

    async login(data: signInDto): Promise<any>{
        const {email, password} = data;

        const  user = await this.userService.findByEmail(email);
        
        if(!user){
            throw new UnauthorizedException("Wrong Credentials");
        }
        
        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if(!isPasswordMatched){
            throw new UnauthorizedException("Wrong Credentials");
        }

        return this.generateToken( user.id, user.username,);

    }

    async getTokenFromRefreshToken(refTokenDto: refreshTokenDto):  Promise<any>{
        const refToken = refTokenDto.token;

        const result = await this.refreshTokenService.getRefreshTokenFromToken(refToken);

        if(!result){
            throw new UnauthorizedException("Invalid token");
        }

        const user = await this.userService.findById(result.user_id);

        return this.generateToken(user.id, user.username);
        
    }

    async generateToken(userId: number,  userName: string){
        const acessToken = this.jwtService.sign({userName, userId});

        // Find token that haven't expired
        const dbRefToken = await this.refreshTokenService.getRefreshTokenFromUserId(userId);
        
        if(dbRefToken){
            return {acessToken,  'refreshToken': dbRefToken.token};

        }

        const refreshToken = uuidv4();
        this.refreshTokenService.create(refreshToken, userId);

        return {acessToken,  refreshToken};
    }


}
