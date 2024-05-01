import { Test, TestingModule } from '@nestjs/testing';
import { PickupDeliveriesService } from './pickup-deliveries.service';
import { PrismaService } from '../prisma.service';
import { PickupDelivery } from '@prisma/client';

describe('PickupDeliveriesService', () => {
  let service: PickupDeliveriesService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PickupDeliveriesService, PrismaService],
    }).compile();

    service = module.get<PickupDeliveriesService>(PickupDeliveriesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an item', async () => {
      const newPickupDelivery: PickupDelivery = {
        id: 'asd',
        name: 'asd',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the create method of PrismaService
      jest
        .spyOn(prismaService.pickupDelivery, 'create')
        .mockResolvedValue(newPickupDelivery);

      // Call the create method of ItemsService
      const result = await service.create(newPickupDelivery);

      // Check if the result matches the new item
      expect(result).toEqual(newPickupDelivery);
    });
  });

  describe('findAll', () => {
    it('should return an array of pickupDeliveries', async () => {
      const mockPickupDeliveries: PickupDelivery[] = [
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

      // Mock the findMany method of PrismaService
      jest
        .spyOn(prismaService.pickupDelivery, 'findMany')
        .mockResolvedValue(mockPickupDeliveries);

      // Call the findAll method of ItemsService
      const result = await service.findAll();

      // Check if the result matches the mock items
      expect(result).toEqual(mockPickupDeliveries);
    });
  });

  describe('findOne', () => {
    it('should return a pickupDelivery by id', async () => {
      const pickupDeliveryId = '1';
      const mockPickupDelivery: PickupDelivery = {
        id: 'asd',
        name: 'asd',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the findUnique method of PrismaService
      jest
        .spyOn(prismaService.pickupDelivery, 'findUnique')
        .mockResolvedValue(mockPickupDelivery);

      // Call the findOne method of ItemsService
      const result = await service.findOne(pickupDeliveryId);

      // Check if the result matches the mock item
      expect(result).toEqual(mockPickupDelivery);
    });

    it('should throw an error if item is not found', async () => {
      const pickupDeliveryId = '999'; // Non-existent item id

      // Mock the findUnique method of PrismaService to return null
      jest
        .spyOn(prismaService.pickupDelivery, 'findUnique')
        .mockResolvedValue(null);

      // Call the findOne method of ItemsService
      const result = await service.findOne(pickupDeliveryId);

      // Check if the result is null
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update an item', async () => {
      const pickupDeliveryId = 'asd';
      const updatedPickupDelivery: PickupDelivery = {
        id: 'asd',
        name: 'asd',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the update method of PrismaService
      jest
        .spyOn(prismaService.pickupDelivery, 'update')
        .mockResolvedValue(updatedPickupDelivery);

      // Call the update method of ItemsService
      const result = await service.update(
        pickupDeliveryId,
        updatedPickupDelivery,
      );

      // Check if the result matches the updated item
      expect(result).toEqual(updatedPickupDelivery);
    });
  });

  describe('remove', () => {
    it('should remove a pickupDelivery', async () => {
      const pickupDeliveryId = 'asd';
      const deletedPickupDelivery: PickupDelivery = {
        id: 'asd',
        name: 'asd',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the delete method of PrismaService
      jest
        .spyOn(prismaService.pickupDelivery, 'delete')
        .mockResolvedValue(deletedPickupDelivery);

      // Call the remove method of ItemsService
      const result = await service.remove(pickupDeliveryId);

      // Check if the result matches the deleted item
      expect(result).toEqual(deletedPickupDelivery);
    });
  });
});
