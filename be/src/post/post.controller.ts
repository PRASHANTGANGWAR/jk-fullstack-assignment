import { Controller, Post, Body, Req, Res, HttpStatus, Logger, Get, UseInterceptors, UploadedFile, UseGuards, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../multer/file.upload.controller';
import { PostService } from './post.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../jwt';
import { getResponseMessage, errorResponse, message } from '../helper/index';
import { Response } from 'express';
import { CreateBlogDto } from './dto/post.dto';

@ApiTags('Post') // Swagger API documentation tag
@ApiBearerAuth() // Adds Bearer Token authentication for API security
@Controller('post') // Defines the base route as '/post'
export class PostController {
  constructor(private readonly postService: PostService) { }
  private readonly logger = new Logger('Blog'); // Logger instance for debugging

  @UseGuards(JwtGuard) // Protects the route with JWT authentication
  @Post() // HTTP POST method for creating a blog
  @UseInterceptors(FileInterceptor('image', multerOptions)) // Handles file uploads
  async createBlog(
    @Req() req, // Request object containing user information
    @Res() res, // Response object to send responses
    @Body() createBlogDto: CreateBlogDto, // DTO for request body validation
    @UploadedFile() file: Express.Multer.File // Uploaded file object
  ) {
    try {
      // Check if an image file is uploaded
      if (!file) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send(errorResponse(false, message.imageRequired));
      }

      // Prepare blog data for saving
      const saveBlogData = {
        ...createBlogDto,
        user_id: req?.user?.id, // Assign user ID from JWT token
        image: file.path // Store the file path
      };

      // Save blog post in the database
      const createBlog = await this.postService.createBlog(saveBlogData);

      // Send success response
      res
        .status(HttpStatus.OK)
        .send(getResponseMessage(true, message.createPost, createBlog));
    } catch (error) {
      this.logger.log(error); // Log error for debugging
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(errorResponse(false, message.serverError));
    }
  }

  @UseGuards(JwtGuard) // Protects the route with JWT authentication
  @Get() // HTTP GET method to fetch all blogs for a user
  async findAll(@Req() req, @Res() res: Response) {
    try {
      const user = req?.user?.id; // Extract user ID from request
      const data = await this.postService.findAllPostsByUser(user); // Fetch all user blogs

      if (data.length) {
        res
          .status(HttpStatus.OK)
          .send(getResponseMessage(true, message.getBlog, data));
      } else {
        res
          .status(HttpStatus.BAD_REQUEST)
          .send(errorResponse(false, message.blogNotFound));
      }
    } catch (error) {
      this.logger.log(error); // Log error for debugging
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(errorResponse(false, message.serverError));
    }
  }

  @UseGuards(JwtGuard) // Protects the route with JWT authentication
  @Get('/:id') // HTTP GET method to fetch a blog by ID
  async findById(
    @Req() req, // Request object containing user details
    @Res() res: Response, // Response object to send responses
    @Param('id') id: string // Blog ID parameter from URL
  ) {
    try {
      const user = req?.user?.id; // Extract user ID from request
      const data = await this.postService.findById(user, id); // Fetch blog post by ID

      if (data) {
        res
          .status(HttpStatus.OK)
          .send(getResponseMessage(true, message.getBlog, data));
      } else {
        res
          .status(HttpStatus.NOT_FOUND)
          .send(errorResponse(false, message.blogNotFound));
      }
    } catch (error) {
      this.logger.log(error); // Log error for debugging
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(errorResponse(false, message.serverError));
    }
  }
}
