import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { OrdersOnItemsService } from './orders-on-items.service';
import { CreateOrdersOnItemDto } from './dto/create-orders-on-item.dto';
import { UpdateOrdersOnItemDto } from './dto/update-orders-on-item.dto';
import { OrdersOnItems, Prisma } from '@prisma/client';
import { PaginatedResult } from 'src/common/utils/paginator.util';

@Controller('orders-on-items')
export class OrdersOnItemsController {
  constructor(private readonly ordersOnItemsService: OrdersOnItemsService) {}

  @Post()
  async create(
    @Body() createOrdersOnItemDto: CreateOrdersOnItemDto,
  ): Promise<OrdersOnItems> {
    return this.ordersOnItemsService.create(createOrdersOnItemDto);
  }

  @Get()
  async findAll(
    @Query('where') where?: Prisma.OrdersOnItemsWhereInput,
    @Query('orderBy') orderBy?: Prisma.OrdersOnItemsOrderByWithRelationInput,
    @Query('page') page?: number,
    @Query('perPage') perPage?: number,
  ): Promise<PaginatedResult<OrdersOnItems>> {
    return this.ordersOnItemsService.findAll({
      where,
      orderBy,
      page,
      perPage,
    });
  }

  @Get(':orderId/:itemId')
  async findOne(
    @Param('orderId') orderId: string,
    @Param('itemId') itemId: string,
  ): Promise<OrdersOnItems | null> {
    return this.ordersOnItemsService.findOne(orderId, itemId);
  }

  @Patch(':orderId/:itemId')
  async update(
    @Param('orderId') orderId: string,
    @Param('itemId') itemId: string,
    @Body() updateOrdersOnItemDto: UpdateOrdersOnItemDto,
  ): Promise<OrdersOnItems> {
    return this.ordersOnItemsService.update(
      orderId,
      itemId,
      updateOrdersOnItemDto,
    );
  }

  @Delete(':orderId/:itemId')
  async remove(
    @Param('orderId') orderId: string,
    @Param('itemId') itemId: string,
  ): Promise<OrdersOnItems> {
    return this.ordersOnItemsService.remove(orderId, itemId);
  }
}
