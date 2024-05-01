import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      // returned password is hashed in real situation
      const newUser: User = {
        id: 'asd',
        username: 'asd',
        password: 'asd',
        roleId: 'asd',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the create method of PrismaService
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(newUser);

      // Call the create method of UsersService
      const result = await service.create(newUser);

      // Check if the result matches the new User
      expect(result).toEqual(newUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers: User[] = [
        {
          id: 'asd',
          username: 'asd',
          password: 'asd',
          roleId: 'asd',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'asd',
          username: 'asd',
          password: 'asd',
          roleId: 'asd',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      // Mock the findMany method of PrismaService
      jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(mockUsers);

      // Call the findAll method of UsersService
      const result = await service.findAll();

      // Check if the result matches the mock Users
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const userId = 'asd';
      const mockUser: User = {
        id: 'asd',
        username: 'asd',
        password: 'asd',
        roleId: 'asd',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the findUnique method of PrismaService
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);

      // Call the findOne method of UsersService
      const result = await service.findOne(userId);

      // Check if the result matches the mock User
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if User is not found', async () => {
      const userId = '999'; // Non-existent User id

      // Mock the findUnique method of PrismaService to return null
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      // Call the findOne method of UsersService
      const result = await service.findOne(userId);

      // Check if the result is null
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = 'asd';
      const updatedUser: User = {
        id: 'asd',
        username: 'asd',
        password: 'asd',
        roleId: 'asd',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the update method of PrismaService
      jest.spyOn(prismaService.user, 'update').mockResolvedValue(updatedUser);

      // Call the update method of UsersService
      const result = await service.update(userId, updatedUser);

      // Check if the result matches the updated User
      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const userId = 'asd';
      const deletedUser: User = {
        id: 'asd',
        username: 'asd',
        password: 'asd',
        roleId: 'asd',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the delete method of PrismaService
      jest.spyOn(prismaService.user, 'delete').mockResolvedValue(deletedUser);

      // Call the remove method of UsersService
      const result = await service.remove(userId);

      // Check if the result matches the deleted User
      expect(result).toEqual(deletedUser);
    });
  });

  describe('findOneUsername', () => {
    it('should return a user by username', async () => {
      const username = 'asd';
      const mockUser: User = {
        id: 'asd',
        username: 'asd',
        password: 'asd',
        roleId: 'asd',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the findUnique method of PrismaService
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);

      // Call the findOneUsername method of UsersService
      const result = await service.findOneUsername(username);

      // Check if the result matches the mock User
      expect(result).toEqual(mockUser);
    });

    it('should return null if user is not found', async () => {
      const username = 'nonexistentuser';

      // Mock the findUnique method of PrismaService to return null
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      // Call the findOneUsername method of UsersService
      const result = await service.findOneUsername(username);

      // Check if the result is null
      expect(result).toBeNull();
    });
  });
});
