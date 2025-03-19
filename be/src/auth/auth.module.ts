import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { User } from '../models/index';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  // Importing SequelizeModule with the User model to enable database interactions
  imports: [SequelizeModule.forFeature([User])],

  // Defining the controller that handles authentication-related requests (e.g., login, register)
  controllers: [AuthController],

  // Providing AuthService, which contains the business logic for authentication
  providers: [AuthService],

  // Exporting AuthService so it can be used in other modules (e.g., UserModule, JwtModule)
  exports: [AuthService],
})
export class AuthModule { } // Defining and exporting the AuthModule
