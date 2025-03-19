import { Module } from '@nestjs/common';
import { GoogleService } from './google.service';
import { GoogleStrategy } from './google.strategy';
import { GoogleController } from './google.controller';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    // Import required modules
    imports: [AuthModule, JwtModule.register({})], // AuthModule for user authentication, JwtModule for handling JWT tokens

    // Define controllers for handling requests
    controllers: [GoogleController], // GoogleController manages authentication routes

    // Define providers (services) used within this module
    providers: [GoogleService, GoogleStrategy], // GoogleService handles business logic, GoogleStrategy manages Google authentication strategy
})
export class GoogleModule { }
