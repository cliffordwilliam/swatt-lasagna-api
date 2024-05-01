import { Module } from '@nestjs/common';
import { PenerimasService } from './penerimas.service';
import { PenerimasController } from './penerimas.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [PenerimasController],
  providers: [PrismaService, PenerimasService],
})
export class PenerimasModule {}
