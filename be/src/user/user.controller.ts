import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Patch,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '../jwt'; // Importing JWT authentication guard
import { UserService } from './user.service'; // Importing user service
import { UpdateUserDto } from './dto/index'; // DTO for updating user details
import { getResponseMessage, errorResponse, message } from '../helper/index'; // Helper functions for response messages

/**
 * UserController handles user-related API endpoints.
 * - It requires JWT authentication for access.
 * - Provides endpoints for fetching and updating user data.
 */
@ApiTags('User') // Grouping the controller under 'User' in Swagger documentation
@ApiBearerAuth() // Requires Bearer Token for authentication
@Controller('users') // Base route: /user
export class UserController {
  constructor(private readonly userService: UserService) { } // Injecting the user service

  private readonly logger = new Logger('User'); // Logger for tracking errors or events

  /**
   * Retrieves the currently authenticated user's details.
   * @param req The request object containing the user details (extracted from JWT).
   * @param res The response object used to send responses.
   */
  @UseGuards(JwtGuard) // Protects the route with JWT authentication
  @Get()
  async findOne(@Req() req: any, @Res() res: Response) {
    try {
      // Fetch user data based on the authenticated user's ID
      const data = await this.userService.findOne(req.user.id);

      if (data) {
        return res
          .status(HttpStatus.OK)
          .send(getResponseMessage(true, message.userFound, data));
      } else {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send(errorResponse(false, message.noUser));
      }
    } catch (error) {
      this.logger.error(error); // Logging the error
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(errorResponse(false, message.serverError));
    }
  }

  /**
   * Updates the authenticated user's details.
   * @param req The request object containing user authentication details.
   * @param updateUserDto The DTO containing fields to update.
   * @param res The response object used to send responses.
   */
  @UseGuards(JwtGuard) // Protects the route with JWT authentication
  @Patch()
  async update(
    @Req() req: any,
    @Body() updateUserDto: UpdateUserDto, // Data Transfer Object for user updates
    @Res() res: Response,
  ) {
    try {
      // Updating user data based on authenticated user's ID
      const data = await this.userService.update(req.user.id, updateUserDto);

      if (data) {
        return res
          .status(HttpStatus.OK)
          .send(getResponseMessage(true, message.updateUser, data));
      } else {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send(errorResponse(false, message.noUser));
      }
    } catch (error) {
      this.logger.error(error); // Logging the error
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(errorResponse(false, message.serverError));
    }
  }
}
