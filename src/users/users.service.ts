import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  create(createUserDto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: createUserDto,
      include: {
        role: true,
      },
    });
  }

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: {
        role: true,
      },
    });
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
}
