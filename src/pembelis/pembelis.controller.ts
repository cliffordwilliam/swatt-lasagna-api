import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PembelisService } from './pembelis.service';
import { CreatePembeliDto } from './dto/create-pembeli.dto';
import { UpdatePembeliDto } from './dto/update-pembeli.dto';
import { Pembeli } from '@prisma/client';

@Controller('pembelis')
export class PembelisController {
  constructor(private readonly pembelisService: PembelisService) {}

  @Post()
  async create(@Body() createPembeliDto: CreatePembeliDto): Promise<Pembeli> {
    return this.pembelisService.create(createPembeliDto);
  }

  @Get()
  async findAll(): Promise<Pembeli[]> {
    return this.pembelisService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Pembeli | null> {
    return this.pembelisService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePembeliDto: UpdatePembeliDto,
  ): Promise<Pembeli> {
    return this.pembelisService.update(id, updatePembeliDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Pembeli> {
    return this.pembelisService.remove(id);
  }
}
