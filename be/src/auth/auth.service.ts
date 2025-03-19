import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { User } from '../models/index';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private user: typeof User) { }

  /**
   * Checks if a user exists in the database based on the provided email.
   * @param reqData - Object containing the email to search for.
   * @returns The user data if found, otherwise null.
   */
  async checkUserExists(reqData: CreateAuthDto): Promise<User> {
    const { email } = reqData;
    const checkUser = await this.user.findOne({
      where: {
        email,
      },
      raw: true, // Ensures the response is a plain object instead of a Sequelize instance
      attributes: ['id', 'email'], // Fetches only the id and email fields
    });
    return checkUser;
  }

  /**
   * Creates a new user in the database.
   * @param reqData - Object containing user details such as first name, last name, email, and phone number.
   * @returns The created user object.
   */
  async createUser(reqData: { first_name?: string, last_name?: string, email?: string, phone_number?: string }): Promise<User> {
    return this.user.create(reqData);
  }

  /**
   * Updates the refresh token for a specific user.
   * @param userId - The ID of the user whose refresh token needs to be updated.
   * @param refreshToken - The new refresh token to store.
   * @returns A promise resolving to the update result.
   */
  async updateUserRefreshToken(userId: number, refreshToken: string): Promise<any> {
    return await this.user.update(
      { refresh_token: refreshToken },
      { where: { id: userId } }
    );
  }
}
