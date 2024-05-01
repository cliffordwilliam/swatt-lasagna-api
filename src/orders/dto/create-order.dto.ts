import { IsDateString, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  @IsNotEmpty()
  pembeliId: string;

  @IsUUID()
  @IsNotEmpty()
  penerimaId: string;

  @IsDateString()
  @IsNotEmpty()
  tanggalOrder: Date;

  @IsDateString()
  @IsNotEmpty()
  tanggalKirim: Date;

  @IsNumber()
  @IsNotEmpty()
  totalPembelian: number;

  @IsUUID()
  @IsNotEmpty()
  pickupDeliveryId: string;

  @IsNumber()
  @IsNotEmpty()
  ongkir: number;

  @IsNumber()
  @IsNotEmpty()
  grandTotal: number;

  @IsUUID()
  @IsNotEmpty()
  pembayaranId: string;
}
