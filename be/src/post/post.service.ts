import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Post } from '../models/index'; // Importing the Post model

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post) private post: typeof Post // Injecting the Post model
  ) { }

  // Function to create a new blog post
  async createBlog(saveBlogData): Promise<Post> {
    return await this.post.create(saveBlogData); // Creating a new post in the database
  }

  // Function to retrieve all blog posts for a specific user
  async findAllPostsByUser(user: string): Promise<Post[]> {
    return await this.post.findAll({ where: { user_id: user } }); // Fetching posts based on user ID
  }

  // Function to retrieve a specific blog post by ID for a user
  async findById(user: string, id: string): Promise<Post> {
    return await this.post.findOne({ where: { user_id: user, id } }); // Fetching a single post by ID and user ID
  }
}
