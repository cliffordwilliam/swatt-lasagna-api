import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { PrismaService } from '../prisma.service';
import { Item, Prisma } from '@prisma/client';
import {
  PaginatedResult,
  PaginateFunction,
  paginator,
} from '../common/utils/paginator.util';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}
  async create(createItemDto: CreateItemDto): Promise<Item> {
    return this.prisma.item.create({
      data: createItemDto,
    });
  }

  async findAll({
    where,
    orderBy,
    page,
    perPage,
  }: {
    where?: Prisma.ItemWhereInput;
    orderBy?: Prisma.ItemOrderByWithRelationInput;
    page?: number;
    perPage?: number;
  }): Promise<PaginatedResult<Item>> {
    const paginate: PaginateFunction = paginator({ perPage: perPage });
    return paginate(
      this.prisma.item,
      {
        where,
        orderBy,
      },
      {
        page,
      },
    );
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
