import { Injectable } from '@nestjs/common';
import { Item } from '@prisma/client';
import { CreateItemDto } from 'src/dto/create-item.dto';
import { UpdateItemDto } from 'src/dto/update-item.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}
  async create(createItemDto: CreateItemDto): Promise<Item> {
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

  async update(id: string, updateItemDto: UpdateItemDto): Promise<Item> {
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
