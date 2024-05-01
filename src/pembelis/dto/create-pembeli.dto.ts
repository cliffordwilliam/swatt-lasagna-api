import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePembeliDto {
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
