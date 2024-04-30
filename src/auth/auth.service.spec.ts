import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  // let userService: UsersService;
  // let jwtService: JwtService;
  // let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService, JwtService, PrismaService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    // userService = module.get<UsersService>(UsersService);
    // jwtService = module.get<JwtService>(JwtService);
    // prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
