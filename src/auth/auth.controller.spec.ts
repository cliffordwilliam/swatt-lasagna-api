import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';

describe('AuthController', () => {
  let controller: AuthController;
  // let userService: UsersService;
  // let jwtService: JwtService;
  // let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, UsersService, JwtService, PrismaService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    // userService = module.get<UsersService>(UsersService);
    // jwtService = module.get<JwtService>(JwtService);
    // prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
