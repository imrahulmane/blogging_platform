import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private JwtService: JwtService){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request:  Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromRequest(request);
    
    if(!token){
        throw new UnauthorizedException("Invalid Token");
    }

    try{
        const payload = this.JwtService.verify(token);
    }catch(e){
        throw new UnauthorizedException("Invalid Token");
    }

    return  true;
  }

  private extractTokenFromRequest(req: Request):  string|undefined{
    return  req.headers.authorization?.split(' ')[1];
  }
}