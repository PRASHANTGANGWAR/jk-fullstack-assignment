import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { User } from '../models/index';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private user: typeof User) { }

  /**
   * Fetches a user by ID.
   * @param id - The unique identifier of the user.
   * @returns The user record if found, otherwise null.
   */
  async findOne(id: number) {
    return await this.user.findOne({
      where: { id }, // Search for the user with the given ID
    });
  }

  /**
   * Updates a user record with the given data.
   * @param id - The unique identifier of the user.
   * @param reqUpdateData - Data to update the user.
   * @returns The updated user record.
   */
  async update(id: number, reqUpdateData: UpdateUserDto) {
    await this.user.update(reqUpdateData, {
      where: { id }, // Update user with matching ID
    });

    return await this.findOne(id); // Return the updated user record
  }
}
