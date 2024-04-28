import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Item } from '@prisma/client';
import { CreateItemDto } from 'src/dto/create-item.dto';
import { UpdateItemDto } from 'src/dto/update-item.dto';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  async create(@Body() createItemDto: CreateItemDto): Promise<Item> {
    return this.itemsService.create(createItemDto);
  }

  @Get()
  async findAll(): Promise<Item[]> {
    return this.itemsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Item | null> {
    return this.itemsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
  ): Promise<Item> {
    return this.itemsService.update(id, updateItemDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Item> {
    return this.itemsService.remove(id);
  }
}
