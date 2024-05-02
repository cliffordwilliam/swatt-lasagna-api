import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserWithRole } from './users.interface';
import {
  PaginatedResult,
  PaginateFunction,
  paginator,
} from '../common/utils/paginator.util';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
      return this.prisma.user.create({
        data: {
          ...createUserDto,
          password: hashedPassword,
        },
        include: {
          role: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  findAll({
    where,
    orderBy,
    page,
    perPage,
  }: {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
    page?: number;
    perPage?: number;
  }): Promise<PaginatedResult<User>> {
    const paginate: PaginateFunction = paginator({ perPage: perPage });
    return paginate(
      this.prisma.user,
      {
        where,
        orderBy,
        include: {
          role: true,
        },
      },
      {
        page,
      },
    );
  }

  findOne(id: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        role: true,
      },
    });
  }

  update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: {
        id: id,
      },
      include: {
        role: true,
      },
      data: updateUserDto,
    });
  }

  remove(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: {
        id: id,
      },
      include: {
        role: true,
      },
    });
  }

  // For login usage
  findOneUsername(username: string): Promise<UserWithRole> {
    return this.prisma.user.findUnique({
      where: {
        username: username,
      },
      include: {
        role: true,
      },
    });
  }
}
