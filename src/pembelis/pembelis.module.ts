import { Module } from '@nestjs/common';
import { PembelisService } from './pembelis.service';
import { PembelisController } from './pembelis.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [PembelisController],
  providers: [PrismaService, PembelisService],
})
export class PembelisModule {}
