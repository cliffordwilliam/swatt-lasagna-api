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
import { PickupDeliveriesService } from './pickup-deliveries.service';
import { CreatePickupDeliveryDto } from './dto/create-pickup-delivery.dto';
import { UpdatePickupDeliveryDto } from './dto/update-pickup-delivery.dto';
import { PickupDelivery, Prisma } from '@prisma/client';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/role.enum';
import { PaginatedResult } from 'src/common/utils/paginator.util';

@Controller('pickup-deliveries')
export class PickupDeliveriesController {
  constructor(
    private readonly pickupDeliveriesService: PickupDeliveriesService,
  ) {}

  @Roles(Role.Admin)
  @Post()
  async create(
    @Body() createPickupDeliveryDto: CreatePickupDeliveryDto,
  ): Promise<PickupDelivery> {
    return this.pickupDeliveriesService.create(createPickupDeliveryDto);
  }

  @Get()
  async findAll(
    @Query('where') where?: Prisma.PickupDeliveryWhereInput,
    @Query('orderBy') orderBy?: Prisma.PickupDeliveryOrderByWithRelationInput,
    @Query('page') page?: number,
    @Query('perPage') perPage?: number,
  ): Promise<PaginatedResult<PickupDelivery>> {
    return this.pickupDeliveriesService.findAll({
      where,
      orderBy,
      page,
      perPage,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PickupDelivery | null> {
    return this.pickupDeliveriesService.findOne(id);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePickupDeliveryDto: UpdatePickupDeliveryDto,
  ): Promise<PickupDelivery> {
    return this.pickupDeliveriesService.update(id, updatePickupDeliveryDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<PickupDelivery> {
    return this.pickupDeliveriesService.remove(id);
  }
}
