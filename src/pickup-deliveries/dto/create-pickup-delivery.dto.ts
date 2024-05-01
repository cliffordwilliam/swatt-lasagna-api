import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePickupDeliveryDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
