import { Module } from '@nestjs/common';
import { PembayaransService } from './pembayarans.service';
import { PembayaransController } from './pembayarans.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [PembayaransController],
  providers: [PrismaService, PembayaransService],
})
export class PembayaransModule {}
