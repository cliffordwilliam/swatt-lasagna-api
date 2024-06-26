import { Injectable } from '@nestjs/common';
import { CreatePenerimaDto } from './dto/create-penerimas.dto';
import { UpdatePenerimaDto } from './dto/update-penerimas.dto';
import { PrismaService } from '../prisma.service';
import { Penerima, Prisma } from '@prisma/client';
import {
  PaginatedResult,
  PaginateFunction,
  paginator,
} from '../common/utils/paginator.util';

@Injectable()
export class PenerimasService {
  constructor(private prisma: PrismaService) {}
  async create(createPenerimaDto: CreatePenerimaDto): Promise<Penerima> {
    return this.prisma.penerima.create({
      data: createPenerimaDto,
    });
  }

  async findAll({
    where,
    orderBy,
    page,
    perPage,
  }: {
    where?: Prisma.PenerimaWhereInput;
    orderBy?: Prisma.PenerimaOrderByWithRelationInput;
    page?: number;
    perPage?: number;
  }): Promise<PaginatedResult<Penerima>> {
    const paginate: PaginateFunction = paginator({ perPage: perPage });
    return paginate(
      this.prisma.penerima,
      {
        where,
        orderBy,
      },
      {
        page,
      },
    );
  }

  async findOne(id: string): Promise<Penerima> {
    return this.prisma.penerima.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(
    id: string,
    updatePenerimaDto: UpdatePenerimaDto,
  ): Promise<Penerima> {
    return this.prisma.penerima.update({
      where: {
        id: id,
      },
      data: updatePenerimaDto,
    });
  }

  async remove(id: string): Promise<Penerima> {
    return this.prisma.penerima.delete({
      where: {
        id: id,
      },
    });
  }
}
