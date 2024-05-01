import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService, JwtService, PrismaService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('should return access token in an object if credentials are correct', async () => {
      // Mock the findOneUsername method of UsersService
      const mockUser = {
        id: 'asd',
        username: 'asd',
        password: 'asd',
        roleId: 'asd',
        createdAt: new Date(),
        updatedAt: new Date(),
      }; // Mocked user data
      jest
        .spyOn(userService, 'findOneUsername')
        .mockImplementation(async () => mockUser);

      // Mock the compare method of bcrypt
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);

      // Mock the signAsync method of JwtService
      const mockAccessToken = 'asd';
      jest
        .spyOn(jwtService, 'signAsync')
        .mockImplementation(async () => mockAccessToken);

      // Call the signIn method
      const result = await service.signIn('asd', 'asd');

      // Check the result
      expect(result).toEqual({ access_token: mockAccessToken });
    });

    it('should throw UnauthorizedException if credentials are incorrect', async () => {
      // Mock the findOneUsername method of UsersService to return null (user not found)
      jest
        .spyOn(userService, 'findOneUsername')
        .mockImplementation(async () => null);

      // Call the signIn method
      await expect(service.signIn('asd', 'asd')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
