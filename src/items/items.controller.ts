import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from '@prisma/client';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/role.enum';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Roles(Role.Admin)
  @Post()
  async create(@Body() createItemDto: CreateItemDto): Promise<Item> {
    return this.itemsService.create(createItemDto);
  }

  @Roles(Role.Admin)
  @Get()
  async findAll(): Promise<Item[]> {
    return this.itemsService.findAll();
  }

  @Roles(Role.Admin)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Item | null> {
    return this.itemsService.findOne(id);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
  ): Promise<Item> {
    return this.itemsService.update(id, updateItemDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Item> {
    return this.itemsService.remove(id);
  }
}
