import { Test, TestingModule } from '@nestjs/testing';
import { PickupDeliveriesController } from './pickup-deliveries.controller';
import { PickupDeliveriesService } from './pickup-deliveries.service';
import { PrismaService } from '../prisma.service';
import { CreatePickupDeliveryDto } from './dto/create-pickup-delivery.dto';
import { PickupDelivery } from '@prisma/client';
import { UpdatePickupDeliveryDto } from './dto/update-pickup-delivery.dto';

describe('PickupDeliveriesController', () => {
  let controller: PickupDeliveriesController;
  let pickupDeliveriesService: PickupDeliveriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PickupDeliveriesController],
      providers: [PickupDeliveriesService, PrismaService],
    }).compile();

    controller = module.get<PickupDeliveriesController>(
      PickupDeliveriesController,
    );
    pickupDeliveriesService = module.get<PickupDeliveriesService>(
      PickupDeliveriesService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a pickupDelivery', async () => {
      const createPickupDeliveryDto: CreatePickupDeliveryDto = {
        name: 'asd',
      };
      const createdPickupDelivery: PickupDelivery = {
        id: 'asd',
        name: 'asd',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the create method of ItemsService
      jest
        .spyOn(pickupDeliveriesService, 'create')
        .mockResolvedValue(createdPickupDelivery);

      // Call the create method of ItemsController
      const result = await controller.create(createPickupDeliveryDto);

      // Check if the result matches the created item
      expect(result).toEqual(createdPickupDelivery);
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

      // Mock the findAll method of ItemsService
      jest
        .spyOn(pickupDeliveriesService, 'findAll')
        .mockResolvedValue(mockPickupDeliveries);

      // Call the findAll method of ItemsController
      const result = await controller.findAll();

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

      // Mock the findOne method of ItemsService
      jest
        .spyOn(pickupDeliveriesService, 'findOne')
        .mockResolvedValue(mockPickupDelivery);

      // Call the findOne method of ItemsController
      const result = await controller.findOne(pickupDeliveryId);

      // Check if the result matches the mock item
      expect(result).toEqual(mockPickupDelivery);
    });

    it('should return null if pickupDelivery is not found', async () => {
      const pickupDeliveryId = '999'; // Non-existent item id

      // Mock the findOne method of ItemsService to return null
      jest.spyOn(pickupDeliveriesService, 'findOne').mockResolvedValue(null);

      // Call the findOne method of ItemsController
      const result = await controller.findOne(pickupDeliveryId);

      // Check if the result is null
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a pickupDelivery', async () => {
      const pickupDeliveryId = '1';
      const updatePickupDeliveryDto: UpdatePickupDeliveryDto = {
        name: 'asd',
      };
      const updatedPickupDelivery: PickupDelivery = {
        id: 'asd',
        name: 'asd',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the update method of ItemsService
      jest
        .spyOn(pickupDeliveriesService, 'update')
        .mockResolvedValue(updatedPickupDelivery);

      // Call the update method of ItemsController
      const result = await controller.update(
        pickupDeliveryId,
        updatePickupDeliveryDto,
      );

      // Check if the result matches the updated item
      expect(result).toEqual(updatedPickupDelivery);
    });
  });

  describe('remove', () => {
    it('should remove a pickupDelivery', async () => {
      const pickupDeliveryId = '1';
      const deletedPickupDelivery: PickupDelivery = {
        id: 'asd',
        name: 'asd',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the remove method of ItemsService
      jest
        .spyOn(pickupDeliveriesService, 'remove')
        .mockResolvedValue(deletedPickupDelivery);

      // Call the remove method of ItemsController
      const result = await controller.remove(pickupDeliveryId);

      // Check if the result matches the deleted item
      expect(result).toEqual(deletedPickupDelivery);
    });
  });
});
