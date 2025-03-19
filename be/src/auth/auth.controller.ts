import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';
import { Controller, Post, Body, Res, HttpStatus, Logger } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { getResponseMessage, errorResponse, message } from '../helper/index';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwt: JwtService,
  ) { }
  private readonly logger = new Logger('Auth');

  @Post('login')
  async login(@Body() createAuthDto: CreateAuthDto, @Res() res: Response) {
    try {
      // Check if user exists
      let user = await this.authService.checkUserExists(createAuthDto);

      if (!user) {
        // Save user if not found
        user = await this.authService.createUser(createAuthDto);
      }

      // Generate JWT token
      const token: string = this.jwt.sign({
        id: user.id,
        email: user.email
      }, {
        expiresIn: '1h',
      });
      // Send response with user and token
      return res.status(HttpStatus.OK).send(getResponseMessage(true, message.login, { user, token }));
    } catch (error) {
      this.logger.log(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorResponse(false, message.serverError));
    }
  }
}
