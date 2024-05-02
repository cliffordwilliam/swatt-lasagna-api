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
import { PembelisService } from './pembelis.service';
import { CreatePembeliDto } from './dto/create-pembeli.dto';
import { UpdatePembeliDto } from './dto/update-pembeli.dto';
import { Pembeli, Prisma } from '@prisma/client';
import { PaginatedResult } from 'src/common/utils/paginator.util';

@Controller('pembelis')
export class PembelisController {
  constructor(private readonly pembelisService: PembelisService) {}

  @Post()
  async create(@Body() createPembeliDto: CreatePembeliDto): Promise<Pembeli> {
    return this.pembelisService.create(createPembeliDto);
  }

  @Get()
  async findAll(
    @Query('where') where?: Prisma.PembeliWhereInput,
    @Query('orderBy') orderBy?: Prisma.PembeliOrderByWithRelationInput,
    @Query('page') page?: number,
    @Query('perPage') perPage?: number,
  ): Promise<PaginatedResult<Pembeli>> {
    return this.pembelisService.findAll({
      where,
      orderBy,
      page,
      perPage,
    });
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
