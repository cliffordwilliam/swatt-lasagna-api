import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { PrismaService } from '../prisma.service';

describe('RolesController', () => {
  let controller: RolesController;
  // let service: RolesService;
  // let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [RolesService, PrismaService],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    // service = module.get<RolesService>(RolesService);
    // prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
