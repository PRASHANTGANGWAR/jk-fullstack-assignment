import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { CreateAuthDto } from './dto/create-auth.dto';
import { HttpStatus } from '@nestjs/common';
import { getResponseMessage, errorResponse, message } from '../helper/index';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let jwtService: JwtService;
  let res: Response;

  const mockAuthService = {
    checkUserExists: jest.fn(),
    createUser: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    res = mockRes as any;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should login an existing user and return a token', async () => {
      const createAuthDto: CreateAuthDto = {
        email: 'test@example.com',
      };
      const user = { id: 1, email: 'test@example.com' };
      const token = 'test-token';

      (authService.checkUserExists as jest.Mock).mockResolvedValue(user);
      (jwtService.sign as jest.Mock).mockReturnValue(token);

      await controller.login(createAuthDto, res);

      expect(authService.checkUserExists).toHaveBeenCalledWith(createAuthDto);
      expect(jwtService.sign).toHaveBeenCalledWith({ id: user.id, email: user.email }, { expiresIn: '1h' });
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(getResponseMessage(true, message.login, { user, token }));
    });

    it('should create a new user and return a token if the user does not exist', async () => {
      const createAuthDto: CreateAuthDto = {
        email: 'newuser@example.com',
      };
      const newUser = { id: 2, email: 'newuser@example.com' };
      const token = 'new-token';

      (authService.checkUserExists as jest.Mock).mockResolvedValue(null);
      (authService.createUser as jest.Mock).mockResolvedValue(newUser);
      (jwtService.sign as jest.Mock).mockReturnValue(token);

      await controller.login(createAuthDto, res);

      expect(authService.checkUserExists).toHaveBeenCalledWith(createAuthDto);
      expect(authService.createUser).toHaveBeenCalledWith(createAuthDto);
      expect(jwtService.sign).toHaveBeenCalledWith({ id: newUser.id, email: newUser.email }, { expiresIn: '1h' });
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(getResponseMessage(true, message.login, { user: newUser, token }));
    });

    it('should handle errors and return a server error response', async () => {
      const createAuthDto: CreateAuthDto = {
        email: 'test@example.com',
      };

      (authService.checkUserExists as jest.Mock).mockRejectedValue(new Error('Test error'));

      await controller.login(createAuthDto, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.send).toHaveBeenCalledWith(errorResponse(false, message.serverError));
    });
  });
});