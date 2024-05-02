import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from '../prisma.service';
import { Role, Prisma } from '@prisma/client';
import {
  PaginatedResult,
  PaginateFunction,
  paginator,
} from '../common/utils/paginator.util';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}
  create(createRoleDto: CreateRoleDto): Promise<Role> {
    return this.prisma.role.create({
      data: createRoleDto,
    });
  }

  findAll({
    where,
    orderBy,
    page,
    perPage,
  }: {
    where?: Prisma.RoleWhereInput;
    orderBy?: Prisma.RoleOrderByWithRelationInput;
    page?: number;
    perPage?: number;
  }): Promise<PaginatedResult<Role>> {
    const paginate: PaginateFunction = paginator({ perPage: perPage });
    return paginate(
      this.prisma.role,
      {
        where,
        orderBy,
      },
      {
        page,
      },
    );
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
