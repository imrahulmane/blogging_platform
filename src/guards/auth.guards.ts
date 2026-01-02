import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private JwtService: JwtService,
    private userService: UserService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
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

      // Verify token version matches user's current token version
      // Only check if tokenVersion exists in payload (for backward compatibility)
      if (payload.tokenVersion !== undefined) {
        const user = await this.userService.findById(payload.userId, [
          'id',
          'token_version',
        ]);

        if (!user) {
          throw new UnauthorizedException('Invalid Token');
        }

        if (payload.tokenVersion !== user.token_version) {
          throw new UnauthorizedException('Token has been invalidated');
        }
      }

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
