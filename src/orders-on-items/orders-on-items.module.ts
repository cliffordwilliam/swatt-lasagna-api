import { Module } from '@nestjs/common';
import { OrdersOnItemsService } from './orders-on-items.service';
import { OrdersOnItemsController } from './orders-on-items.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [OrdersOnItemsController],
  providers: [PrismaService, OrdersOnItemsService],
})
export class OrdersOnItemsModule {}
