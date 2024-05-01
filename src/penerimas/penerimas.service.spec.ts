import { Test, TestingModule } from '@nestjs/testing';
import { PenerimasService } from './penerimas.service';

describe('PembelisService', () => {
  let service: PenerimasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PenerimasService],
    }).compile();

    service = module.get<PenerimasService>(PenerimasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
