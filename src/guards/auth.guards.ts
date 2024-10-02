import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private JwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const { route } = request;

    // List the routes you want to exclude
    const excludedRoutes = [
      { method: 'POST', path: '/auth/signup' },
      { method: 'POST', path: '/auth/login' },
      { method: 'POST', path: '/auth/refresh' },
      { method: 'POST', path: '/auth/forgot-password' },
      { method: 'POST', path: '/auth/reset-password' },
      { method: 'GET', path: '/blogs' },
      { method: 'GET', path: '/blogs/search' },
    ];

    // Check if the current route matches any of the excluded routes
    const isExcluded = excludedRoutes.some(
      (r) =>
        r.method === request.method &&
        r.path === request.route.path.replace('/api/v1', ''),
    );

    // Bypass guard if it's an excluded route
    if (isExcluded) {
      return true;
    }

    const token = this.extractTokenFromRequest(request);

    if (!token) {
      throw new UnauthorizedException('Invalid Token');
    }

    try {
      const payload = this.JwtService.verify(token);

      request.userId = payload.userId;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      throw new UnauthorizedException('Invalid Token');
    }

    return true;
  }

  private extractTokenFromRequest(req: Request): string | undefined {
    return req.headers.authorization?.split(' ')[1];
  }
}
