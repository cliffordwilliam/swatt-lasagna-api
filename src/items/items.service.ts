import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}
  create(createItemDto: CreateItemDto) {
    return {
      message: 'This action adds a new item',
      data: createItemDto,
    };
  }

  findAll() {
    return this.prisma.item.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} item`;
  }

  update(id: number, updateItemDto: UpdateItemDto) {
    return {
      message: `This action updates a #${id} item`,
      data: updateItemDto,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
