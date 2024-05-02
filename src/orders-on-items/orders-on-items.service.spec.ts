import { Test, TestingModule } from '@nestjs/testing';
import { OrdersOnItemsService } from './orders-on-items.service';

describe('OrdersOnItemsService', () => {
  let service: OrdersOnItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersOnItemsService],
    }).compile();

    service = module.get<OrdersOnItemsService>(OrdersOnItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
