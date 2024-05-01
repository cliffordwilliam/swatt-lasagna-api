import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { PrismaService } from '../prisma.service';
import { Role } from '@prisma/client';

describe('RolesService', () => {
  let service: RolesService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesService, PrismaService],
    }).compile();

    service = module.get<RolesService>(RolesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an role', async () => {
      const newRole: Role = {
        id: 'asd',
        name: 'asd',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the create method of PrismaService
      jest.spyOn(prismaService.role, 'create').mockResolvedValue(newRole);

      // Call the create method of RolesService
      const result = await service.create(newRole);

      // Check if the result matches the new Role
      expect(result).toEqual(newRole);
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
          id: 'asd',
          name: 'asd',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      // Mock the findMany method of PrismaService
      jest.spyOn(prismaService.role, 'findMany').mockResolvedValue(mockRoles);

      // Call the findAll method of RolesService
      const result = await service.findAll();

      // Check if the result matches the mock Roles
      expect(result).toEqual(mockRoles);
    });
  });

  describe('findOne', () => {
    it('should return a role by id', async () => {
      const roleId = 'asd';
      const mockRole: Role = {
        id: 'asd',
        name: 'asd',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the findUnique method of PrismaService
      jest.spyOn(prismaService.role, 'findUnique').mockResolvedValue(mockRole);

      // Call the findOne method of RolesService
      const result = await service.findOne(roleId);

      // Check if the result matches the mock Role
      expect(result).toEqual(mockRole);
    });

    it('should throw an error if Role is not found', async () => {
      const roleId = '999'; // Non-existent Role id

      // Mock the findUnique method of PrismaService to return null
      jest.spyOn(prismaService.role, 'findUnique').mockResolvedValue(null);

      // Call the findOne method of RolesService
      const result = await service.findOne(roleId);

      // Check if the result is null
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a role', async () => {
      const roleId = 'asd';
      const updatedRole: Role = {
        id: 'asd',
        name: 'asd',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the update method of PrismaService
      jest.spyOn(prismaService.role, 'update').mockResolvedValue(updatedRole);

      // Call the update method of RolesService
      const result = await service.update(roleId, updatedRole);

      // Check if the result matches the updated Role
      expect(result).toEqual(updatedRole);
    });
  });

  describe('remove', () => {
    it('should remove a role', async () => {
      const roleId = 'asd';
      const deletedRole: Role = {
        id: 'asd',
        name: 'asd',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the delete method of PrismaService
      jest.spyOn(prismaService.role, 'delete').mockResolvedValue(deletedRole);

      // Call the remove method of RolesService
      const result = await service.remove(roleId);

      // Check if the result matches the deleted Role
      expect(result).toEqual(deletedRole);
    });
  });
});
