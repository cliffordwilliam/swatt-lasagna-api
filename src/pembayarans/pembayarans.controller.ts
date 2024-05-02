import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Pembayaran, Prisma } from '@prisma/client';
import { CreatePembayaranDto } from './dto/create-pembayaran.dto';
import { UpdatePembayaranDto } from './dto/update-pembayaran.dto';
import { PembayaransService } from './pembayarans.service';
import { PaginatedResult } from 'src/common/utils/paginator.util';

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
  async findAll(
    @Query('where') where?: Prisma.PembayaranWhereInput,
    @Query('orderBy') orderBy?: Prisma.PembayaranOrderByWithRelationInput,
    @Query('page') page?: number,
    @Query('perPage') perPage?: number,
  ): Promise<PaginatedResult<Pembayaran>> {
    return this.pembayaransService.findAll({
      where,
      orderBy,
      page,
      perPage,
    });
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
