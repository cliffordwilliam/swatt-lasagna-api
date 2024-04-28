import { Injectable } from '@nestjs/common';
import { Item, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}
  async create(createItemDto: Prisma.ItemCreateInput): Promise<Item> {
    return this.prisma.item.create({
      data: createItemDto,
    });
  }

  async findAll(): Promise<Item[]> {
    return this.prisma.item.findMany();
  }

  async findOne(id: string): Promise<Item> {
    return this.prisma.item.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(
    id: string,
    updateItemDto: Prisma.ItemUpdateInput,
  ): Promise<Item> {
    return this.prisma.item.update({
      where: {
        id,
      },
      data: updateItemDto,
    });
  }

  async remove(id: string): Promise<Item> {
    return this.prisma.item.delete({
      where: {
        id,
      },
    });
  }
}
