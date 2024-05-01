import { Injectable } from '@nestjs/common';
import { CreatePembayaranDto } from './dto/create-pembayaran.dto';
import { UpdatePembayaranDto } from './dto/update-pembayaran.dto';
import { PrismaService } from '../prisma.service';
import { Pembayaran } from '@prisma/client';

@Injectable()
export class PembayaransService {
  constructor(private prisma: PrismaService) {}
  async create(createPembayaranDto: CreatePembayaranDto): Promise<Pembayaran> {
    return this.prisma.pembayaran.create({
      data: createPembayaranDto,
    });
  }

  async findAll(): Promise<Pembayaran[]> {
    return this.prisma.pembayaran.findMany();
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
