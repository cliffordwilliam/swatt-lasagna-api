import { Test, TestingModule } from '@nestjs/testing';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { PrismaService } from '../prisma.service';

describe('ItemsController', () => {
  let controller: ItemsController;
  // let service: ItemsService;
  // let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsController],
      providers: [ItemsService, PrismaService],
    }).compile();

    controller = module.get<ItemsController>(ItemsController);
    // service = module.get<ItemsService>(ItemsService);
    // prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
