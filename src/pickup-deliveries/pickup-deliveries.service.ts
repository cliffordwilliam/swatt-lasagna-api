import { Injectable } from '@nestjs/common';
import { CreatePickupDeliveryDto } from './dto/create-pickup-delivery.dto';
import { UpdatePickupDeliveryDto } from './dto/update-pickup-delivery.dto';
import { PrismaService } from '../prisma.service';
import { PickupDelivery } from '@prisma/client';

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

  async findAll(): Promise<PickupDelivery[]> {
    return this.prisma.pickupDelivery.findMany();
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
