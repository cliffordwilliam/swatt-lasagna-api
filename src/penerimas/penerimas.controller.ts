import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PenerimasService } from './penerimas.service';
import { CreatePenerimaDto } from './dto/create-penerimas.dto';
import { UpdatePenerimaDto } from './dto/update-penerimas.dto';
import { Penerima } from '@prisma/client';

@Controller('penerimas')
export class PenerimasController {
  constructor(private readonly penerimasService: PenerimasService) {}

  @Post()
  async create(
    @Body() createPenerimaDto: CreatePenerimaDto,
  ): Promise<Penerima> {
    return this.penerimasService.create(createPenerimaDto);
  }

  @Get()
  async findAll(): Promise<Penerima[]> {
    return this.penerimasService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Penerima | null> {
    return this.penerimasService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePenerimaDto: UpdatePenerimaDto,
  ): Promise<Penerima> {
    return this.penerimasService.update(id, updatePenerimaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Penerima> {
    return this.penerimasService.remove(id);
  }
}
