import { Observable } from 'rxjs';
import { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { errorResponse, message } from '../helper/index';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService, // Injects JWT service for token verification
    private readonly config: ConfigService // Injects ConfigService to access environment variables
  ) { }

  /**
   * The `canActivate` method determines whether a request is authorized.
   * It extracts and verifies the JWT token from the request header.
   *
   * @param context - The execution context for the request
   * @returns `true` if the request is authorized, otherwise `false`
   */
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    let res;
    try {

      const jwtpk = this.config.get<string>('jwtPrivateKey');
      const ctx: HttpArgumentsHost = context.switchToHttp();
      res = ctx.getResponse();

      // Get the request object
      const req: Request = ctx.getRequest();

      // Extract JWT token from the Authorization header (Bearer Token)
      const token: string = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

      // If no token is found, send an Unauthorized response
      if (!token) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .send(errorResponse(false, message.unauthorizedUser));
        return false;
      }

      // Verify the JWT token using the secret key
      const user: any = this.jwt.verify(token, { secret: jwtpk });

      // If token verification fails, send an Unauthorized response
      if (!user) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .send(errorResponse(false, message.unauthorizedUser));
        return false;
      }

      // Attach the verified user object to the request
      req['user'] = user;

      return true;
    } catch (e) {
      Logger.error(e);
      res
        .status(HttpStatus.UNAUTHORIZED)
        .send(errorResponse(false, message.unauthorizedUser));
      return false;
    }
  }
}
