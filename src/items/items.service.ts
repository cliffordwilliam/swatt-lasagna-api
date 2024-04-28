import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}
  create(createItemDto: Prisma.ItemCreateInput) {
    return this.prisma.item.create({
      data: createItemDto,
    });
  }

  findAll() {
    return this.prisma.item.findMany();
  }

  findOne(id: string) {
    return this.prisma.item.findUnique({
      where: {
        id: id,
      },
    });
  }

  update(id: string, updateItemDto: Prisma.ItemUpdateInput) {
    return this.prisma.item.update({
      where: {
        id,
      },
      data: updateItemDto,
    });
  }

  remove(id: string) {
    return this.prisma.item.delete({
      where: {
        id,
      },
    });
  }
}
