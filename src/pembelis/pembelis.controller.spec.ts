import { Test, TestingModule } from '@nestjs/testing';
import { PembelisController } from './pembelis.controller';
import { PembelisService } from './pembelis.service';

describe('PembelisController', () => {
  let controller: PembelisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PembelisController],
      providers: [PembelisService],
    }).compile();

    controller = module.get<PembelisController>(PembelisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
