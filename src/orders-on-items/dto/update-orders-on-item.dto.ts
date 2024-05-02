import { PartialType } from '@nestjs/mapped-types';
import { CreateOrdersOnItemDto } from './create-orders-on-item.dto';

export class UpdateOrdersOnItemDto extends PartialType(CreateOrdersOnItemDto) {}
