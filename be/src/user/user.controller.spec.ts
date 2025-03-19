import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/sequelize';
import { User } from '../models/index';

describe('UserService', () => {
  let service: UserService;
  let userModelMock: any;

  beforeEach(async () => {
    userModelMock = {
      findOne: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User),
          useValue: userModelMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  // Test case for findOne (success)
  it('should return user data when findOne is called with a valid ID', async () => {
    const userId = 1;
    const mockUser = {
      id: userId,
      first_name: 'John',
      last_name: 'Doe',
      phone_number: '9999999999',
      email: 'john@example.com',
      created_at: new Date('2024-01-01T10:00:00Z'),
      updated_at: new Date('2024-02-01T12:00:00Z')
    };

    userModelMock.findOne.mockResolvedValue(mockUser);
    const result = await service.findOne(userId);

    expect(userModelMock.findOne).toHaveBeenCalledWith({ where: { id: userId } });
    expect(result).toEqual(mockUser);
  });

  // Test case for findOne (not found)
  it('should return null when findOne is called with an invalid ID', async () => {
    const userId = 999;
    userModelMock.findOne.mockResolvedValue(null);

    const result = await service.findOne(userId);

    expect(userModelMock.findOne).toHaveBeenCalledWith({ where: { id: userId } });
    expect(result).toBeNull();
  });

  // Test case for findOne (error handling)
  it('should throw an error when findOne encounters a database error', async () => {
    const userId = 1;
    userModelMock.findOne.mockRejectedValue(new Error('Database error'));

    await expect(service.findOne(userId)).rejects.toThrow('Database error');
    expect(userModelMock.findOne).toHaveBeenCalledWith({ where: { id: userId } });
  });

  // Test case for update (success)
  it('should return updated user data when update is called with a valid ID and data', async () => {
    const userId = 1;
    const updateData = {
      first_name: 'John',
      last_name: 'Doe',
      phone_number: '9999999999',
    };

    const updatedUser = {
      id: userId,
      ...updateData,
      email: 'john@example.com',
      created_at: new Date('2024-01-01T10:00:00Z'),
      updated_at: new Date('2024-02-01T12:00:00Z'),
    };

    userModelMock.update.mockResolvedValue([1]); // Sequelize returns [1] if one row was updated
    userModelMock.findOne.mockResolvedValue(updatedUser); // Mocking the findOne call after update

    const result = await service.update(userId, updateData);

    expect(userModelMock.update).toHaveBeenCalledWith(updateData, { where: { id: userId } });
    expect(userModelMock.findOne).toHaveBeenCalledWith({ where: { id: userId } });
    expect(result).toEqual(updatedUser);
  });

  // Test case for update (not found)
  it('should return null when update is called with an invalid ID', async () => {
    const userId = 999;
    const updateData = { first_name: 'John', last_name: 'Doe', phone_number: '9999999999' };

    userModelMock.update.mockResolvedValue([0]); // Sequelize returns [0] if no rows were updated
    userModelMock.findOne.mockResolvedValue(null); // Mocking findOne to return null

    const result = await service.update(userId, updateData);

    expect(userModelMock.update).toHaveBeenCalledWith(updateData, { where: { id: userId } });
    expect(userModelMock.findOne).toHaveBeenCalledWith({ where: { id: userId } });
    expect(result).toBeNull();
  });

  // Test case for update (error handling)
  it('should throw an error when update encounters a database error', async () => {
    const userId = 1;
    const updateData = { first_name: 'John', last_name: 'Doe', phone_number: '9999999999' };

    userModelMock.update.mockRejectedValue(new Error('Database error'));

    await expect(service.update(userId, updateData)).rejects.toThrow('Database error');
    expect(userModelMock.update).toHaveBeenCalledWith(updateData, { where: { id: userId } });
  });

});
