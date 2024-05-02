import { Injectable } from '@nestjs/common';
import { CreatePickupDeliveryDto } from './dto/create-pickup-delivery.dto';
import { UpdatePickupDeliveryDto } from './dto/update-pickup-delivery.dto';
import { PrismaService } from '../prisma.service';
import { PickupDelivery, Prisma } from '@prisma/client';
import {
  PaginatedResult,
  PaginateFunction,
  paginator,
} from '../common/utils/paginator.util';

@Injectable()
export class PickupDeliveriesService {
  constructor(private prisma: PrismaService) {}
  async create(
    createPickupDeliveryDto: CreatePickupDeliveryDto,
  ): Promise<PickupDelivery> {
    return this.prisma.pickupDelivery.create({
      data: createPickupDeliveryDto,
    });
  }

  async findAll({
    where,
    orderBy,
    page,
    perPage,
  }: {
    where?: Prisma.PickupDeliveryWhereInput;
    orderBy?: Prisma.PickupDeliveryOrderByWithRelationInput;
    page?: number;
    perPage?: number;
  }): Promise<PaginatedResult<PickupDelivery>> {
    const paginate: PaginateFunction = paginator({ perPage: perPage });
    return paginate(
      this.prisma.pickupDelivery,
      {
        where,
        orderBy,
      },
      {
        page,
      },
    );
  }

  async findOne(id: string): Promise<PickupDelivery> {
    return this.prisma.pickupDelivery.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(id: string, updatePickupDeliveryDto: UpdatePickupDeliveryDto) {
    return this.prisma.pickupDelivery.update({
      where: {
        id: id,
      },
      data: updatePickupDeliveryDto,
    });
  }

  async remove(id: string) {
    return this.prisma.pickupDelivery.delete({
      where: {
        id: id,
      },
    });
  }
}
