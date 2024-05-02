import { Injectable } from '@nestjs/common';
import { CreateOrdersOnItemDto } from './dto/create-orders-on-item.dto';
import { UpdateOrdersOnItemDto } from './dto/update-orders-on-item.dto';
import { PrismaService } from '../prisma.service';
import { OrdersOnItems, Prisma } from '@prisma/client';
import {
  PaginatedResult,
  PaginateFunction,
  paginator,
} from '../common/utils/paginator.util';

@Injectable()
export class OrdersOnItemsService {
  constructor(private prisma: PrismaService) {}
  async create(
    createOrdersOnItemDto: CreateOrdersOnItemDto,
  ): Promise<OrdersOnItems> {
    return this.prisma.ordersOnItems.create({
      data: createOrdersOnItemDto,
      include: {
        item: true,
        order: true,
      },
    });
  }

  async findAll({
    where,
    orderBy,
    page,
    perPage,
  }: {
    where?: Prisma.OrdersOnItemsWhereInput;
    orderBy?: Prisma.OrdersOnItemsOrderByWithRelationInput;
    page?: number;
    perPage?: number;
  }): Promise<PaginatedResult<OrdersOnItems>> {
    const paginate: PaginateFunction = paginator({ perPage: perPage });
    return paginate(
      this.prisma.ordersOnItems,
      {
        where,
        orderBy,
        include: {
          item: true,
          order: true,
        },
      },
      {
        page,
      },
    );
  }

  async findOne(orderId: string, itemId: string): Promise<OrdersOnItems> {
    return this.prisma.ordersOnItems.findUnique({
      where: {
        orderId_itemId: {
          orderId,
          itemId,
        },
      },
      include: {
        item: true,
        order: true,
      },
    });
  }

  async update(
    orderId: string,
    itemId: string,
    updateOrdersOnItemDto: UpdateOrdersOnItemDto,
  ): Promise<OrdersOnItems> {
    return this.prisma.ordersOnItems.update({
      where: {
        orderId_itemId: {
          orderId,
          itemId,
        },
      },
      data: updateOrdersOnItemDto,
      include: {
        item: true,
        order: true,
      },
    });
  }

  async remove(orderId: string, itemId: string): Promise<OrdersOnItems> {
    return this.prisma.ordersOnItems.delete({
      where: {
        orderId_itemId: {
          orderId,
          itemId,
        },
      },
      include: {
        item: true,
        order: true,
      },
    });
  }
}
