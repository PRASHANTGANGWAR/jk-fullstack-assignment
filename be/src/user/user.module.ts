import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from '../models/index';

/**
 * UserModule is responsible for handling user-related functionalities.
 * - It imports the SequelizeModule with the `User` model for database interaction.
 * - It provides the `UserService` to handle business logic.
 * - It registers the `UserController` to expose API endpoints.
 */
@Module({
  imports: [SequelizeModule.forFeature([User])], // Registering User model with Sequelize
  controllers: [UserController], // Declaring the UserController for handling API requests
  providers: [UserService], // Providing UserService for handling business logic
})
export class UserModule { }
