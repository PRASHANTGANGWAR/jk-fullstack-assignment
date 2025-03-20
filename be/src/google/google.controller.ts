import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { GoogleService } from './google.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { message } from '../helper/contant.message';
import { ConfigService } from '@nestjs/config';

@Controller('google')
export class GoogleController {
  getHello(): any {
    throw new Error(message.methodNotImplemented);
  }

  constructor(
    private readonly googleService: GoogleService,
    private readonly authService: AuthService,
    private readonly config: ConfigService,
    private jwt: JwtService,
  ) { }

  // Initiates Google authentication
  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    return { msg: message.googleAuthInitiated };
  }

  // Handles the Google authentication redirect
  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    try {
      const jwtExpiry = this.config.get<string>('jwtExpiry');
      const frontendUrl = this.config.get<string>('frontendUrl');

      // Retrieve user information from Google login response
      let user = this.googleService.googleLogin(req);

      const userData = {
        email: user?.email,
        first_name: user?.firstName,
        last_name: user?.lastName,
      };

      // Check if the user already exists in the system
      user = await this.authService.checkUserExists(userData);
      if (!user) {
        // Save user if not found
        user = await this.authService.createUser(userData);
      }

      // Generate JWT token for the authenticated user
      const token: string = this.jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        {
          expiresIn: jwtExpiry,
        },
      );

      // Redirect user to frontend with authentication token or error message
      if (user && token) {
        res.redirect(`${frontendUrl}?token=${token}&email=${user?.email}`);
      } else {
        res.redirect(`${frontendUrl}/login?error=LoginFailed`);
      }
    } catch (error) {
      console.error(message.googleAuthRedirectError, error);
      res.redirect(`${this.config.get('frontendUrl')}/login?error=ServerError`);
    }
  }
}
