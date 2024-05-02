import { Injectable } from '@nestjs/common';
import { CreatePembeliDto } from './dto/create-pembeli.dto';
import { UpdatePembeliDto } from './dto/update-pembeli.dto';
import { PrismaService } from '../prisma.service';
import { Pembeli, Prisma } from '@prisma/client';
import {
  PaginatedResult,
  PaginateFunction,
  paginator,
} from '../common/utils/paginator.util';

@Injectable()
export class PembelisService {
  constructor(private prisma: PrismaService) {}
  async create(createPembeliDto: CreatePembeliDto): Promise<Pembeli> {
    return this.prisma.pembeli.create({
      data: createPembeliDto,
    });
  }

  async findAll({
    where,
    orderBy,
    page,
    perPage,
  }: {
    where?: Prisma.PembeliWhereInput;
    orderBy?: Prisma.PembeliOrderByWithRelationInput;
    page?: number;
    perPage?: number;
  }): Promise<PaginatedResult<Pembeli>> {
    const paginate: PaginateFunction = paginator({ perPage: perPage });
    return paginate(
      this.prisma.pembeli,
      {
        where,
        orderBy,
      },
      {
        page,
      },
    );
  }

  async findOne(id: string): Promise<Pembeli> {
    return this.prisma.pembeli.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(
    id: string,
    updatePembeliDto: UpdatePembeliDto,
  ): Promise<Pembeli> {
    return this.prisma.pembeli.update({
      where: {
        id: id,
      },
      data: updatePembeliDto,
    });
  }

  async remove(id: string): Promise<Pembeli> {
    return this.prisma.pembeli.delete({
      where: {
        id: id,
      },
    });
  }
}
