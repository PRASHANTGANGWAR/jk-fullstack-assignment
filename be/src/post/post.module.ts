import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Post } from '../models/index'; // Importing the Post model
import { PostService } from './post.service'; // Importing the PostService
import { PostController } from './post.controller'; // Importing the PostController

// NestJS module to manage blog-related functionality
@Module({
    imports: [SequelizeModule.forFeature([Post])], // Import SequelizeModule with the Post model
    controllers: [PostController], // Register the PostController
    providers: [PostService], // Provide PostService as a dependency
})
export class BlogModule { } // Exporting the BlogModule
