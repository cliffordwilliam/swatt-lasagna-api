import { Test, TestingModule } from '@nestjs/testing';
import { OrdersOnItemsController } from './orders-on-items.controller';
import { OrdersOnItemsService } from './orders-on-items.service';

describe('OrdersOnItemsController', () => {
  let controller: OrdersOnItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersOnItemsController],
      providers: [OrdersOnItemsService],
    }).compile();

    controller = module.get<OrdersOnItemsController>(OrdersOnItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
