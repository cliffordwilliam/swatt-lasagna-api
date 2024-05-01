import { Test, TestingModule } from '@nestjs/testing';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { PrismaService } from '../prisma.service';
import { CreateItemDto } from './dto/create-item.dto';
import { Item } from '@prisma/client';
import { UpdateItemDto } from './dto/update-item.dto';

describe('ItemsController', () => {
  let controller: ItemsController;
  let itemsService: ItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsController],
      providers: [ItemsService, PrismaService],
    }).compile();

    controller = module.get<ItemsController>(ItemsController);
    itemsService = module.get<ItemsService>(ItemsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an item', async () => {
      const createItemDto: CreateItemDto = {
        nama: 'asd',
        tipe: 'asd',
        harga: 123,
      };
      const createdItem: Item = {
        id: 'asd',
        nama: 'asd',
        tipe: 'asd',
        harga: 123,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the create method of ItemsService
      jest.spyOn(itemsService, 'create').mockResolvedValue(createdItem);

      // Call the create method of ItemsController
      const result = await controller.create(createItemDto);

      // Check if the result matches the created item
      expect(result).toEqual(createdItem);
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

      // Mock the findAll method of ItemsService
      jest.spyOn(itemsService, 'findAll').mockResolvedValue(mockItems);

      // Call the findAll method of ItemsController
      const result = await controller.findAll();

      // Check if the result matches the mock items
      expect(result).toEqual(mockItems);
    });
  });

  describe('findOne', () => {
    it('should return an item by id', async () => {
      const itemId = '1';
      const mockItem: Item = {
        id: 'asd',
        nama: 'asd',
        tipe: 'asd',
        harga: 123,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the findOne method of ItemsService
      jest.spyOn(itemsService, 'findOne').mockResolvedValue(mockItem);

      // Call the findOne method of ItemsController
      const result = await controller.findOne(itemId);

      // Check if the result matches the mock item
      expect(result).toEqual(mockItem);
    });

    it('should return null if item is not found', async () => {
      const itemId = '999'; // Non-existent item id

      // Mock the findOne method of ItemsService to return null
      jest.spyOn(itemsService, 'findOne').mockResolvedValue(null);

      // Call the findOne method of ItemsController
      const result = await controller.findOne(itemId);

      // Check if the result is null
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update an item', async () => {
      const itemId = '1';
      const updateItemDto: UpdateItemDto = {
        nama: 'asd',
        tipe: 'asd',
        harga: 123,
      };
      const updatedItem: Item = {
        id: 'asd',
        nama: 'asd',
        tipe: 'asd',
        harga: 123,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the update method of ItemsService
      jest.spyOn(itemsService, 'update').mockResolvedValue(updatedItem);

      // Call the update method of ItemsController
      const result = await controller.update(itemId, updateItemDto);

      // Check if the result matches the updated item
      expect(result).toEqual(updatedItem);
    });
  });

  describe('remove', () => {
    it('should remove an item', async () => {
      const itemId = '1';
      const deletedItem: Item = {
        id: 'asd',
        nama: 'asd',
        tipe: 'asd',
        harga: 123,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the remove method of ItemsService
      jest.spyOn(itemsService, 'remove').mockResolvedValue(deletedItem);

      // Call the remove method of ItemsController
      const result = await controller.remove(itemId);

      // Check if the result matches the deleted item
      expect(result).toEqual(deletedItem);
    });
  });
});
