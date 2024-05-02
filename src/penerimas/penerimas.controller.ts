import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PenerimasService } from './penerimas.service';
import { CreatePenerimaDto } from './dto/create-penerimas.dto';
import { UpdatePenerimaDto } from './dto/update-penerimas.dto';
import { Penerima, Prisma } from '@prisma/client';
import { PaginatedResult } from 'src/common/utils/paginator.util';

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
  async findAll(
    @Query('where') where?: Prisma.PenerimaWhereInput,
    @Query('orderBy') orderBy?: Prisma.PenerimaOrderByWithRelationInput,
    @Query('page') page?: number,
    @Query('perPage') perPage?: number,
  ): Promise<PaginatedResult<Penerima>> {
    return this.penerimasService.findAll({
      where,
      orderBy,
      page,
      perPage,
    });
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
