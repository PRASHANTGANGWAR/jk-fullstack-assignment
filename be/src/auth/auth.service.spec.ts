import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { CreateAuthDto } from './dto/create-auth.dto';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkUserExists', () => {
    it('should return the user if it exists', async () => {
      const createAuthDto: CreateAuthDto = { email: 'test@example.com' };
      const existingUser = { id: 1, email: 'test@example.com' };

      mockUserRepository.findOne.mockResolvedValue(existingUser);

      const result = await service.checkUserExists(createAuthDto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: createAuthDto.email },
        attributes: ['id', 'email'],
        raw: true,
      });
      expect(result).toEqual(existingUser);
    });

    it('should return null if the user does not exist', async () => {
      const createAuthDto: CreateAuthDto = { email: 'nonexistent@example.com' };

      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.checkUserExists(createAuthDto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: createAuthDto.email },
        attributes: ['id', 'email'],
        raw: true,
      });
      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create and return a new user', async () => {
      const createAuthDto: CreateAuthDto = { email: 'newuser@example.com' };
      const newUser = { id: 2, email: 'newuser@example.com' };

      mockUserRepository.create.mockResolvedValue(newUser);

      const result = await service.createUser(createAuthDto);

      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: createAuthDto.email,
      });
      expect(result).toEqual(newUser);
    });

    it('should handle errors during user creation', async () => {
      const createAuthDto: CreateAuthDto = { email: 'error@example.com' };

      mockUserRepository.create.mockRejectedValue(new Error('Database error'));

      await expect(service.createUser(createAuthDto)).rejects.toThrow('Database error');
    });
  });
});
