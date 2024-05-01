import { Test, TestingModule } from '@nestjs/testing';
import { ItemsService } from './items.service';
import { PrismaService } from '../prisma.service';
import { Item } from '@prisma/client';

describe('ItemsService', () => {
  let service: ItemsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemsService, PrismaService],
    }).compile();

    service = module.get<ItemsService>(ItemsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an item', async () => {
      const newItem: Item = {
        id: 'asd',
        nama: 'asd',
        tipe: 'asd',
        harga: 123,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the create method of PrismaService
      jest.spyOn(prismaService.item, 'create').mockResolvedValue(newItem);

      // Call the create method of ItemsService
      const result = await service.create(newItem);

      // Check if the result matches the new item
      expect(result).toEqual(newItem);
    });
  });

  describe('findAll', () => {
    it('should return an array of items', async () => {
      const mockItems: Item[] = [
        {
          id: 'asd',
          nama: 'asd',
          tipe: 'asd',
          harga: 123,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'asdasd',
          nama: 'asdasd',
          tipe: 'asdasd',
          harga: 123123,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      // Mock the findMany method of PrismaService
      jest.spyOn(prismaService.item, 'findMany').mockResolvedValue(mockItems);

      // Call the findAll method of ItemsService
      const result = await service.findAll();

      // Check if the result matches the mock items
      expect(result).toEqual(mockItems);
    });
  });

  describe('findOne', () => {
    it('should return an item by id', async () => {
      const itemId = 'asd';
      const mockItem: Item = {
        id: 'asd',
        nama: 'asd',
        tipe: 'asd',
        harga: 123,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the findUnique method of PrismaService
      jest.spyOn(prismaService.item, 'findUnique').mockResolvedValue(mockItem);

      // Call the findOne method of ItemsService
      const result = await service.findOne(itemId);

      // Check if the result matches the mock item
      expect(result).toEqual(mockItem);
    });

    it('should throw an error if item is not found', async () => {
      const itemId = '999'; // Non-existent item id

      // Mock the findUnique method of PrismaService to return null
      jest.spyOn(prismaService.item, 'findUnique').mockResolvedValue(null);

      // Call the findOne method of ItemsService
      const result = await service.findOne(itemId);

      // Check if the result is null
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update an item', async () => {
      const itemId = 'asd';
      const updatedItem: Item = {
        id: 'asd',
        nama: 'asd',
        tipe: 'asd',
        harga: 123,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the update method of PrismaService
      jest.spyOn(prismaService.item, 'update').mockResolvedValue(updatedItem);

      // Call the update method of ItemsService
      const result = await service.update(itemId, updatedItem);

      // Check if the result matches the updated item
      expect(result).toEqual(updatedItem);
    });
  });

  describe('remove', () => {
    it('should remove an item', async () => {
      const itemId = 'asd';
      const deletedItem: Item = {
        id: 'asd',
        nama: 'asd',
        tipe: 'asd',
        harga: 123,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the delete method of PrismaService
      jest.spyOn(prismaService.item, 'delete').mockResolvedValue(deletedItem);

      // Call the remove method of ItemsService
      const result = await service.remove(itemId);

      // Check if the result matches the deleted item
      expect(result).toEqual(deletedItem);
    });
  });
});
