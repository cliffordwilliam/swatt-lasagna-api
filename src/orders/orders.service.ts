import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from '../prisma.service';
import { Order, Prisma } from '@prisma/client';
import {
  PaginatedResult,
  PaginateFunction,
  paginator,
} from '../common/utils/paginator.util';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    return this.prisma.order.create({
      data: createOrderDto,
      include: {
        pembeli: true,
        penerima: true,
        pickupDelivery: true,
        pembayaran: true,
        items: {
          include: {
            item: true,
          },
        },
      },
    });
  }

  async findAll({
    where,
    orderBy,
    page,
    perPage,
  }: {
    where?: Prisma.OrderWhereInput;
    orderBy?: Prisma.OrderOrderByWithRelationInput;
    page?: number;
    perPage?: number;
  }): Promise<PaginatedResult<Order>> {
    const paginate: PaginateFunction = paginator({ perPage: perPage });
    return paginate(
      this.prisma.order,
      {
        where,
        orderBy,
        include: {
          pembeli: true,
          penerima: true,
          pickupDelivery: true,
          pembayaran: true,
          items: {
            include: {
              item: true,
            },
          },
        },
      },
      {
        page,
      },
    );
  }

  async findOne(id: string): Promise<Order> {
    return this.prisma.order.findUnique({
      where: {
        id: id,
      },
      include: {
        pembeli: true,
        penerima: true,
        pickupDelivery: true,
        pembayaran: true,
        items: {
          include: {
            item: true,
          },
        },
      },
    });
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    return this.prisma.order.update({
      where: {
        id,
      },
      data: updateOrderDto,
      include: {
        pembeli: true,
        penerima: true,
        pickupDelivery: true,
        pembayaran: true,
        items: {
          include: {
            item: true,
          },
        },
      },
    });
  }

  async remove(id: string): Promise<Order> {
    return this.prisma.order.delete({
      where: {
        id,
      },
      include: {
        pembeli: true,
        penerima: true,
        pickupDelivery: true,
        pembayaran: true,
        items: {
          include: {
            item: true,
          },
        },
      },
    });
  }
}
