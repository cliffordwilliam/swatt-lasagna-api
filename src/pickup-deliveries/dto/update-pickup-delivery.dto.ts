import { PartialType } from '@nestjs/mapped-types';
import { CreatePickupDeliveryDto } from './create-pickup-delivery.dto';

export class UpdatePickupDeliveryDto extends PartialType(
  CreatePickupDeliveryDto,
) {}
