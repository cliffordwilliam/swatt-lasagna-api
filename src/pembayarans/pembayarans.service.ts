import { Injectable } from '@nestjs/common';
import { CreatePembayaranDto } from './dto/create-pembayaran.dto';
import { UpdatePembayaranDto } from './dto/update-pembayaran.dto';
import { PrismaService } from '../prisma.service';
import { Pembayaran, Prisma } from '@prisma/client';
import {
  PaginatedResult,
  PaginateFunction,
  paginator,
} from '../common/utils/paginator.util';

@Injectable()
export class PembayaransService {
  constructor(private prisma: PrismaService) {}
  async create(createPembayaranDto: CreatePembayaranDto): Promise<Pembayaran> {
    return this.prisma.pembayaran.create({
      data: createPembayaranDto,
    });
  }

  async findAll({
    where,
    orderBy,
    page,
    perPage,
  }: {
    where?: Prisma.PembayaranWhereInput;
    orderBy?: Prisma.PembayaranOrderByWithRelationInput;
    page?: number;
    perPage?: number;
  }): Promise<PaginatedResult<Pembayaran>> {
    const paginate: PaginateFunction = paginator({ perPage: perPage });
    return paginate(
      this.prisma.pembayaran,
      {
        where,
        orderBy,
      },
      {
        page,
      },
    );
  }

  async findOne(id: string): Promise<Pembayaran> {
    return this.prisma.pembayaran.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(
    id: string,
    updatePembayaranDto: UpdatePembayaranDto,
  ): Promise<Pembayaran> {
    return this.prisma.pembayaran.update({
      where: {
        id: id,
      },
      data: updatePembayaranDto,
    });
  }

  async remove(id: string) {
    return this.prisma.pembayaran.delete({
      where: {
        id: id,
      },
    });
  }
}
