import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}
  create(createRoleDto: CreateRoleDto): Promise<Role> {
    return this.prisma.role.create({
      data: createRoleDto,
    });
  }

  findAll(): Promise<Role[]> {
    return this.prisma.role.findMany();
  }

  findOne(id: string): Promise<Role> {
    return this.prisma.role.findUnique({
      where: {
        id: id,
      },
    });
  }

  update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    return this.prisma.role.update({
      where: {
        id: id,
      },
      data: updateRoleDto,
    });
  }

  remove(id: string): Promise<Role> {
    return this.prisma.role.delete({
      where: {
        id: id,
      },
    });
  }
}
