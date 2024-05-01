import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePembayaranDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
