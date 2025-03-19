import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { getResponseMessage, errorResponse, message } from '../helper/index';
import { CreateBlogDto } from './dto/post.dto';
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
    canActivate: jest.fn((context: ExecutionContext) => true), // Always allow access in tests
  })),
}));

describe('PostController', () => {
  let controller: PostController;
  let service: PostService;
  let res: Response;

  const mockPostService = {
    createBlog: jest.fn(),
    findAllPostsByUser: jest.fn(),
    findById: jest.fn(),
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

  describe('createBlog', () => {
    it('should create a blog successfully', async () => {
      const req = { user: { id: 1 } };
      const createBlogDto: CreateBlogDto = { title: 'Test Blog', body: 'This is a test' };
      const file: Express.Multer.File = {
        fieldname: 'image',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test'),
        size: 1024,
        destination: 'uploads/',
        filename: 'test-file.jpg',
        path: 'uploads/test-file.jpg',
        stream: null,
      };

      const savedBlog = { id: 1, ...createBlogDto, user_id: 1, image: file.path };
      mockPostService.createBlog.mockResolvedValue(savedBlog);

      await controller.createBlog(req, res, createBlogDto, file);

      expect(service.createBlog).toHaveBeenCalledWith({
        ...createBlogDto,
        user_id: req.user.id,
        image: file.path,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(getResponseMessage(true, message.createPost, savedBlog));
    });

    it('should return error if no file is uploaded', async () => {
      const req = { user: { id: 1 } };
      const createBlogDto: CreateBlogDto = { title: 'Test Blog', body: 'This is a test' };

      await controller.createBlog(req, res, createBlogDto, null);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(errorResponse(false, message.imageRequired));
    });

    it('should return server error on failure', async () => {
      const req = { user: { id: 1 } };
      const createBlogDto: CreateBlogDto = { title: 'Test Blog', body: 'This is a test' };
      const file: Express.Multer.File = {
        fieldname: 'image',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test'),
        size: 1024,
        destination: 'uploads/',
        filename: 'test-file.jpg',
        path: 'uploads/test-file.jpg',
        stream: null,
      };

      mockPostService.createBlog.mockRejectedValue(new Error('Database Error'));

      await controller.createBlog(req, res, createBlogDto, file);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(errorResponse(false, message.serverError));
    });
  });

  describe('findAll', () => {
    it('should return all blogs for a user', async () => {
      const req = { user: { id: 1 } };
      const blogs = [{ id: 1, title: 'Test Blog', body: 'body', user_id: 1 }];

      mockPostService.findAllPostsByUser.mockResolvedValue(blogs);

      await controller.findAll(req, res);

      expect(service.findAllPostsByUser).toHaveBeenCalledWith(req.user.id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(getResponseMessage(true, message.getBlog, blogs));
    });

    it('should return error if no blogs are found', async () => {
      const req = { user: { id: 1 } };

      mockPostService.findAllPostsByUser.mockResolvedValue([]);

      await controller.findAll(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(errorResponse(false, message.blogNotFound));
    });

    it('should return server error on failure', async () => {
      const req = { user: { id: 1 } };

      mockPostService.findAllPostsByUser.mockRejectedValue(new Error('Database Error'));

      await controller.findAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(errorResponse(false, message.serverError));
    });
  });

  describe('findById', () => {
    it('should return a blog by ID', async () => {
      const req = { user: { id: 1 } };
      const blog = { id: 1, title: 'Test Blog', body: 'body', user_id: 1 };

      mockPostService.findById.mockResolvedValue(blog);

      await controller.findById(req, res, '1');

      expect(service.findById).toHaveBeenCalledWith(req.user.id, '1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(getResponseMessage(true, message.getBlog, blog));
    });

    it('should return 404 if blog is not found', async () => {
      const req = { user: { id: 1 } };

      mockPostService.findById.mockResolvedValue(null);

      await controller.findById(req, res, '1');

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith(errorResponse(false, message.blogNotFound));
    });

    it('should return server error on failure', async () => {
      const req = { user: { id: 1 } };

      mockPostService.findById.mockRejectedValue(new Error('Database Error'));

      await controller.findById(req, res, '1');

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(errorResponse(false, message.serverError));
    });
  });
});