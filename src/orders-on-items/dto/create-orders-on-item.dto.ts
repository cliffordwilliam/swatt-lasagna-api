import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateOrdersOnItemDto {
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsUUID()
  orderId: string;

  @IsNotEmpty()
  @IsUUID()
  itemId: string;
}
