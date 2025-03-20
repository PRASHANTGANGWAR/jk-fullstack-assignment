import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { getResponseMessage, errorResponse, message } from '../helper/index';
import { Response } from 'express';
import { ExecutionContext } from '@nestjs/common';

// Mock Response object
const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnThis();
  res.send = jest.fn().mockReturnThis();
  return res as Response;
};

// Mock JwtGuard
jest.mock('../jwt', () => ({
  JwtGuard: jest.fn().mockImplementation(() => ({
    canActivate: jest.fn((context: ExecutionContext) => true),
  })),
}));

describe('PostController', () => {
  let controller: PostController;
  let service: PostService;
  let res: Response;

  const mockPostService = {
    findAllPostsByUser: jest.fn(),
    findById: jest.fn(),
    createBlog: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [{ provide: PostService, useValue: mockPostService }],
    }).compile();

    controller = module.get<PostController>(PostController);
    service = module.get<PostService>(PostService);
    res = mockResponse();
  });

  describe('findAll', () => {
    it('should return all posts for a user', async () => {
      const req = { user: { id: 1 } };
      const post = [{ id: 1, title: 'Test Blog', body: 'body', user_id: 1 }];

      mockPostService.findAllPostsByUser.mockResolvedValue(post);

      await controller.findAll(req, res);

      expect(service.findAllPostsByUser).toHaveBeenCalledWith(req.user.id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(getResponseMessage(true, message.getBlog, post));
    });

    it('should return error if no posts are found', async () => {
      const req = { user: { id: 1 } };

      mockPostService.findAllPostsByUser.mockResolvedValue([]);

      await controller.findAll(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith(errorResponse(false, message.blogNotFound));
    });

    it('should handle server errors', async () => {
      const req = { user: { id: 1 } };

      mockPostService.findAllPostsByUser.mockRejectedValue(new Error('Database error'));

      await controller.findAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(errorResponse(false, message.serverError));
    });
  });

  describe('findById', () => {
    it('should return a post by ID', async () => {
      const req = { user: { id: 1 } };
      const post = { id: 1, title: 'Test Blog', body: 'body', user_id: 1 };

      mockPostService.findById.mockResolvedValue(post);

      await controller.findById(req, res, '1');

      expect(service.findById).toHaveBeenCalledWith(req.user.id, '1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(getResponseMessage(true, message.getBlog, post));
    });

    it('should return error if post is not found', async () => {
      const req = { user: { id: 1 } };

      mockPostService.findById.mockResolvedValue(null);

      await controller.findById(req, res, '1');

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith(errorResponse(false, message.blogNotFound));
    });

    it('should handle server errors', async () => {
      const req = { user: { id: 1 } };

      mockPostService.findById.mockRejectedValue(new Error('Database error'));

      await controller.findById(req, res, '1');

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(errorResponse(false, message.serverError));
    });
  });

  describe('createBlog', () => {
    it('should create a blog post', async () => {
      const req = { user: { id: 1 } };
      const file = { path: 'uploads/test.jpg' } as Express.Multer.File;
      const createBlogDto = { title: 'New Blog', body: 'Content' };
      const createdPost = { id: 1, ...createBlogDto, user_id: 1, image: file.path };

      mockPostService.createBlog.mockResolvedValue(createdPost);

      await controller.createBlog(req, res, createBlogDto, file);

      expect(service.createBlog).toHaveBeenCalledWith(expect.objectContaining({
        title: 'New Blog',
        body: 'Content',
        user_id: 1,
        image: file.path,
      }));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(getResponseMessage(true, message.createPost, createdPost));
    });

    it('should return error if no image is uploaded', async () => {
      const req = { user: { id: 1 } };
      const createBlogDto = { title: 'New Blog', body: 'Content' };

      await controller.createBlog(req, res, createBlogDto, null);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(errorResponse(false, message.imageRequired));
    });

    it('should handle server errors', async () => {
      const req = { user: { id: 1 } };
      const file = { path: 'uploads/test.jpg' } as Express.Multer.File;
      const createBlogDto = { title: 'New Blog', body: 'Content' };

      mockPostService.createBlog.mockRejectedValue(new Error('Database error'));

      await controller.createBlog(req, res, createBlogDto, file);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(errorResponse(false, message.serverError));
    });
  });
});
