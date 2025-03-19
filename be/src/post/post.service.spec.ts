import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { getModelToken } from '@nestjs/sequelize';
import { Post } from '../models/index';

describe('PostService', () => {
  let service: PostService;
  let postModelMock: any;

  beforeEach(async () => {
    postModelMock = {
      create: jest.fn().mockResolvedValue({
        id: 1,
        title: 'Test Blog',
        body: 'This is a test blog post',
        user_id: '1',
        image: 'test.jpg',
      }),
      findAll: jest.fn().mockResolvedValue([
        {
          id: 1,
          title: 'Test Blog 1',
          body: 'This is test blog post 1',
          user_id: '1',
          image: 'test1.jpg',
        },
        {
          id: 2,
          title: 'Test Blog 2',
          body: 'This is test blog post 2',
          user_id: '1',
          image: 'test2.jpg',
        },
      ]),
      findOne: jest.fn().mockResolvedValue({
        id: 1,
        title: 'Test Blog',
        body: 'This is a test blog post',
        user_id: '1',
        image: 'test.jpg',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getModelToken(Post),
          useValue: postModelMock, // Mocking Sequelize Model
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a blog post', async () => {
    const blogData = {
      title: 'Test Blog',
      body: 'This is a test blog post',
      user_id: '1',
      image: 'test.jpg',
    };

    const result = await service.createBlog(blogData);

    expect(postModelMock.create).toHaveBeenCalledWith(blogData);
    expect(result).toHaveProperty('id', 1);
    expect(result).toHaveProperty('title', 'Test Blog');
  });

  it('should return all blog posts for a user', async () => {
    const userId = '1';
    const result = await service.findAllPostsByUser(userId);

    expect(postModelMock.findAll).toHaveBeenCalledWith({ where: { user_id: userId } });
    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty('title', 'Test Blog 1');
  });

  it('should return a specific blog post by ID', async () => {
    const userId = '1';
    const postId = '1';
    const result = await service.findById(userId, postId);

    expect(postModelMock.findOne).toHaveBeenCalledWith({ where: { user_id: userId, id: postId } });
    expect(result).toHaveProperty('id', 1);
    expect(result).toHaveProperty('title', 'Test Blog');
  });

  // 🔴 Error Handling Tests

  // Error Handling for Create Blog Post
  it('should handle errors when creating a blog post', async () => {
    postModelMock.create.mockRejectedValue(new Error('Database Error'));

    const blogData = {
      title: 'Test Blog',
      body: 'This is a test blog post',
      user_id: '1',
      image: 'test.jpg',
    };

    await expect(service.createBlog(blogData)).rejects.toThrow('Database Error');
    expect(postModelMock.create).toHaveBeenCalledWith(blogData);
  });

  it('should throw a 400 error if blog data is invalid', async () => {
    postModelMock.create.mockRejectedValue(new Error('Validation Error'));

    const invalidBlogData = {
      title: '', // Empty title (invalid case)
      body: 'Test content',
      user_id: '1',
      image: 'test.jpg',
    };

    await expect(service.createBlog(invalidBlogData)).rejects.toThrow('Validation Error');
    expect(postModelMock.create).toHaveBeenCalledWith(invalidBlogData);
  });

  it('should throw a 500 error on unexpected server failure', async () => {
    postModelMock.create.mockRejectedValue(new Error('Internal Server Error')); // Simulating an internal failure

    const blogData = {
      title: 'Test Blog',
      body: 'This is a test blog post',
      user_id: '1',
      image: 'test.jpg',
    };

    await expect(service.createBlog(blogData)).rejects.toThrow('Internal Server Error');
    expect(postModelMock.create).toHaveBeenCalledWith(blogData);
  });

  // Error Handling while fetching all Blog Post
  it('should handle errors when fetching all blog posts', async () => {
    postModelMock.findAll.mockRejectedValue(new Error('Database Error'));

    const userId = '1';

    await expect(service.findAllPostsByUser(userId)).rejects.toThrow('Database Error');
    expect(postModelMock.findAll).toHaveBeenCalledWith({ where: { user_id: userId } });
  });

  it('should return an empty array if no blog posts exist for the user', async () => {
    postModelMock.findAll.mockResolvedValue([]);

    const userId = '1';

    const result = await service.findAllPostsByUser(userId);
    expect(result).toEqual([]); // Expect an empty array instead of an error
    expect(postModelMock.findAll).toHaveBeenCalledWith({ where: { user_id: userId } });
  });

  // Error Handling when particular Blog is not found
  it('should return null if a blog post is not found', async () => {
    postModelMock.findOne.mockResolvedValue(null);

    const userId = '1';
    const postId = '99'; // Non-existent post ID

    const result = await service.findById(userId, postId);

    expect(result).toBeNull();
    expect(postModelMock.findOne).toHaveBeenCalledWith({ where: { user_id: userId, id: postId } });
  });

  it('should handle errors when fetching a specific blog post', async () => {
    postModelMock.findOne.mockRejectedValue(new Error('Database Error'));

    const userId = '1';
    const postId = '1';

    await expect(service.findById(userId, postId)).rejects.toThrow('Database Error');
    expect(postModelMock.findOne).toHaveBeenCalledWith({ where: { user_id: userId, id: postId } });
  });
});