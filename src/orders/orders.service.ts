import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from '../prisma.service';
import { Order } from '@prisma/client';

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
      },
    });
  }

  async findAll(): Promise<Order[]> {
    return this.prisma.order.findMany({
      include: {
        pembeli: true,
        penerima: true,
        pickupDelivery: true,
        pembayaran: true,
      },
    });
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
      },
    });
  }
}
