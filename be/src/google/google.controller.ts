import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { GoogleService } from './google.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { message } from '../helper/contant.message';

@Controller('google')
export class GoogleController {
  getHello(): any {
    throw new Error(message.methodNotImplemented);
  }

  constructor(
    private readonly googleService: GoogleService,
    private readonly authService: AuthService,
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
      // Retrieve user information from Google login response
      let user = this.googleService.googleLogin(req);

      const userData = {
        email: user?.email,
        first_name: user?.firstName,
        last_name: user?.lastName,
      };

      // Check if the user already exists in the system
      let check = await this.authService.checkUserExists(userData);
      if (!check) {
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
          expiresIn: '1h',
        },
      );

      // Redirect user to frontend with authentication token or error message
      if (user && token) {
        res.redirect(`${process.env.FRONTEND_URL}?token=${token}&email=${user?.email}`);
      } else {
        res.redirect(`${process.env.FRONTEND_URL}/login?error=LoginFailed`);
      }
    } catch (error) {
      console.error(message.googleAuthRedirectError, error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=ServerError`);
    }
  }
}
