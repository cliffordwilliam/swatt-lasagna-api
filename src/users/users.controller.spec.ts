import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;
  // let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, PrismaService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    // prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createItemDto: CreateUserDto = {
        username: 'asd',
        password: 'asd',
        roleId: 'asd',
      };
      const createdItem: User = {
        id: 'asd',
        username: 'asd',
        password: 'asd',
        roleId: 'asd',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the create method of ItemsService
      jest.spyOn(usersService, 'create').mockResolvedValue(createdItem);

      // Call the create method of ItemsController
      const result = await controller.create(createItemDto);

      // Check if the result matches the created item
      expect(result).toEqual(createdItem);
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

      // Mock the findAll method of ItemsService
      jest.spyOn(usersService, 'findAll').mockResolvedValue(mockUsers);

      // Call the findAll method of ItemsController
      const result = await controller.findAll();

      // Check if the result matches the mock items
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findOne', () => {
    it('should return an item by id', async () => {
      const userId = '1';
      const mockUser: User = {
        id: 'asd',
        username: 'asd',
        password: 'asd',
        roleId: 'asd',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the findOne method of ItemsService
      jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser);

      // Call the findOne method of ItemsController
      const result = await controller.findOne(userId);

      // Check if the result matches the mock item
      expect(result).toEqual(mockUser);
    });

    it('should return null if item is not found', async () => {
      const userId = '999'; // Non-existent item id

      // Mock the findOne method of ItemsService to return null
      jest.spyOn(usersService, 'findOne').mockResolvedValue(null);

      // Call the findOne method of ItemsController
      const result = await controller.findOne(userId);

      // Check if the result is null
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = {
        username: 'asd',
        password: 'asd',
        roleId: 'asd',
      };
      const updatedUser: User = {
        id: 'asd',
        username: 'asd',
        password: 'asd',
        roleId: 'asd',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the update method of ItemsService
      jest.spyOn(usersService, 'update').mockResolvedValue(updatedUser);

      // Call the update method of ItemsController
      const result = await controller.update(userId, updateUserDto);

      // Check if the result matches the updated item
      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const userId = '1';
      const deletedUser: User = {
        id: 'asd',
        username: 'asd',
        password: 'asd',
        roleId: 'asd',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the remove method of ItemsService
      jest.spyOn(usersService, 'remove').mockResolvedValue(deletedUser);

      // Call the remove method of ItemsController
      const result = await controller.remove(userId);

      // Check if the result matches the deleted item
      expect(result).toEqual(deletedUser);
    });
  });
});
