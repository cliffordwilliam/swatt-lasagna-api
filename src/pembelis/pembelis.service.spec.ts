import { Test, TestingModule } from '@nestjs/testing';
import { PembelisService } from './pembelis.service';

describe('PembelisService', () => {
  let service: PembelisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PembelisService],
    }).compile();

    service = module.get<PembelisService>(PembelisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
