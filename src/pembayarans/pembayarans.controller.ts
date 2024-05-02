import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Pembayaran } from '@prisma/client';
import { CreatePembayaranDto } from './dto/create-pembayaran.dto';
import { UpdatePembayaranDto } from './dto/update-pembayaran.dto';
import { PembayaransService } from './pembayarans.service';

@Controller('pembayarans')
export class PembayaransController {
  constructor(private readonly pembayaransService: PembayaransService) {}

  @Post()
  async create(
    @Body() createPembayaranDto: CreatePembayaranDto,
  ): Promise<Pembayaran> {
    return this.pembayaransService.create(createPembayaranDto);
  }

  @Get()
  async findAll(): Promise<Pembayaran[]> {
    return this.pembayaransService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Pembayaran | null> {
    return this.pembayaransService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePembayaranDto: UpdatePembayaranDto,
  ): Promise<Pembayaran> {
    return this.pembayaransService.update(id, updatePembayaranDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Pembayaran> {
    return this.pembayaransService.remove(id);
  }
}
