import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

import { AppService } from './app.service';
import { JwtModule } from './jwt/jwt.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './post/post.module';
import { AppController } from './app.controller';
import { ConfigModule } from './config/config.module';
import { GoogleModule } from './google/google.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    GoogleModule,  // Handles Google OAuth authentication
    UserModule,    // Manages user-related features
    DatabaseModule, // Handles database connection and configurations
    ConfigModule,  // Loads application configurations
    AuthModule,    // Authentication module for handling user login/signup
    JwtModule,     // JWT module for authentication/authorization
    BlogModule,    // Module for blog-related features (assuming it's for blog posts)

    // Logger module setup using `nestjs-pino`
    LoggerModule.forRoot({
      pinoHttp: {
        customProps: (req, res) => ({
          context: 'HTTP', // Adds context to logs
        }),
        transport: {
          target: 'pino-pretty', // Formats logs in a readable way
          options: {
            singleLine: true, // Logs each request in a single line
          },
        },
      },
    }),
  ],
  controllers: [AppController], // Defines controllers for handling HTTP requests
  providers: [AppService], // Provides services for application logic
})
export class AppModule { }
