import { Injectable } from '@nestjs/common';
import { CreatePembeliDto } from './dto/create-pembeli.dto';
import { UpdatePembeliDto } from './dto/update-pembeli.dto';
import { PrismaService } from '../prisma.service';
import { Pembeli } from '@prisma/client';

@Injectable()
export class PembelisService {
  constructor(private prisma: PrismaService) {}
  async create(createPembeliDto: CreatePembeliDto): Promise<Pembeli> {
    return this.prisma.pembeli.create({
      data: createPembeliDto,
    });
  }

  async findAll(): Promise<Pembeli[]> {
    return this.prisma.pembeli.findMany();
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
