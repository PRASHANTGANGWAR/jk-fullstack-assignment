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
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

import { errorResponse, message } from '../helper/index';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) { }

  /**
   * The `canActivate` method checks if the request is authorized.
   * It extracts and verifies the JWT token from the request header.
   *
   * @param context - The execution context for the current request
   * @returns `true` if the request is authorized, `false` otherwise
   */
  canActivate(context: ExecutionContext): any | Promise<any> | Observable<any> {
    let res;
    try {
      // Switch execution context to HTTP
      const ctx: HttpArgumentsHost = context.switchToHttp();
      res = ctx.getResponse();

      // Get the request object
      const req: Request = ctx.getRequest();

      // Extract JWT token from the Authorization header (Bearer Token)
      const token: string = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      if (!token) {
        // If no token is found, send an Unauthorized response
        res
          .status(HttpStatus.UNAUTHORIZED)
          .send(errorResponse(false, message.unauthorizedUser));
      }

      // Verify the JWT token
      const user: any = this.jwt.verify(token);

      if (!user) {
        // If token verification fails, send an Unauthorized response
        res
          .status(HttpStatus.UNAUTHORIZED)
          .send(errorResponse(false, message.unauthorizedUser));
      }

      // Attach the verified user object to the request
      req['user'] = user;

      return true; // Grant access
    } catch (e) {
      Logger.error(e); // Log any errors

      // Send an Unauthorized response in case of an error
      res
        .status(HttpStatus.UNAUTHORIZED)
        .send(errorResponse(false, message.unauthorizedUser));
      return false; // Deny access
    }
  }
}
