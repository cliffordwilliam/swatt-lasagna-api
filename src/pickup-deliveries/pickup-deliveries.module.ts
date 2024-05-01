import { Module } from '@nestjs/common';
import { PickupDeliveriesService } from './pickup-deliveries.service';
import { PickupDeliveriesController } from './pickup-deliveries.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [PickupDeliveriesController],
  providers: [PrismaService, PickupDeliveriesService],
})
export class PickupDeliveriesModule {}
