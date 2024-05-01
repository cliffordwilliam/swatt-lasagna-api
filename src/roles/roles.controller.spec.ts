import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { PrismaService } from '../prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from '@prisma/client';
import { UpdateRoleDto } from './dto/update-role.dto';

describe('RolesController', () => {
  let controller: RolesController;
  let rolesService: RolesService;
  // let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [RolesService, PrismaService],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    rolesService = module.get<RolesService>(RolesService);
    // prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a role', async () => {
      const createRoleDto: CreateRoleDto = {
        name: 'asd',
      };
      const createdRole: Role = {
        id: 'asd',
        name: 'asd',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the create method of RolesService
      jest.spyOn(rolesService, 'create').mockResolvedValue(createdRole);

      // Call the create method of RolesController
      const result = await controller.create(createRoleDto);

      // Check if the result matches the created role
      expect(result).toEqual(createdRole);
    });
  });

  describe('findAll', () => {
    it('should return an array of roles', async () => {
      const mockRoles: Role[] = [
        {
          id: 'asd',
          name: 'asd',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'asdasd',
          name: 'asdasd',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      // Mock the findAll method of RolesService
      jest.spyOn(rolesService, 'findAll').mockResolvedValue(mockRoles);

      // Call the findAll method of RolesController
      const result = await controller.findAll();

      // Check if the result matches the mock Roles
      expect(result).toEqual(mockRoles);
    });
  });

  describe('findOne', () => {
    it('should return a role by id', async () => {
      const roleId = '1';
      const mockRole: Role = {
        id: 'asd',
        name: 'asd',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the findOne method of RolesService
      jest.spyOn(rolesService, 'findOne').mockResolvedValue(mockRole);

      // Call the findOne method of RolesController
      const result = await controller.findOne(roleId);

      // Check if the result matches the mock role
      expect(result).toEqual(mockRole);
    });

    it('should return null if role is not found', async () => {
      const roleId = '999'; // Non-existent role id

      // Mock the findOne method of RolesService to return null
      jest.spyOn(rolesService, 'findOne').mockResolvedValue(null);

      // Call the findOne method of RolesController
      const result = await controller.findOne(roleId);

      // Check if the result is null
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update an role', async () => {
      const roleId = '1';
      const updateRoleDto: UpdateRoleDto = {
        name: 'asd',
      };
      const updatedRole: Role = {
        id: 'asd',
        name: 'asd',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the update method of RolesService
      jest.spyOn(rolesService, 'update').mockResolvedValue(updatedRole);

      // Call the update method of RolesController
      const result = await controller.update(roleId, updateRoleDto);

      // Check if the result matches the updated role
      expect(result).toEqual(updatedRole);
    });
  });
});
