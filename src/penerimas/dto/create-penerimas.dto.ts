import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePenerimaDto {
  @IsNotEmpty()
  @IsString()
  nama: string;

  @IsNotEmpty()
  @IsString()
  alamat: string;

  @IsNotEmpty()
  @IsString()
  noHp: string;
}
