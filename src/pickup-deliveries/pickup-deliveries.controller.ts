import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PickupDeliveriesService } from './pickup-deliveries.service';
import { CreatePickupDeliveryDto } from './dto/create-pickup-delivery.dto';
import { UpdatePickupDeliveryDto } from './dto/update-pickup-delivery.dto';
import { PickupDelivery } from '@prisma/client';

@Controller('pickup-deliveries')
export class PickupDeliveriesController {
  constructor(
    private readonly pickupDeliveriesService: PickupDeliveriesService,
  ) {}

  @Post()
  async create(
    @Body() createPickupDeliveryDto: CreatePickupDeliveryDto,
  ): Promise<PickupDelivery> {
    return this.pickupDeliveriesService.create(createPickupDeliveryDto);
  }

  @Get()
  async findAll(): Promise<PickupDelivery[]> {
    return this.pickupDeliveriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PickupDelivery | null> {
    return this.pickupDeliveriesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePickupDeliveryDto: UpdatePickupDeliveryDto,
  ): Promise<PickupDelivery> {
    return this.pickupDeliveriesService.update(id, updatePickupDeliveryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<PickupDelivery> {
    return this.pickupDeliveriesService.remove(id);
  }
}
