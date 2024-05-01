import { Test, TestingModule } from '@nestjs/testing';
import { PenerimasController } from './penerimas.controller';
import { PenerimasService } from './penerimas.service';

describe('PembelisController', () => {
  let controller: PenerimasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PenerimasController],
      providers: [PenerimasService],
    }).compile();

    controller = module.get<PenerimasController>(PenerimasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
