import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, UsersService, JwtService, PrismaService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should return access token when credentials are correct', async () => {
      const signInDto = { username: 'testuser', password: 'testpassword' };
      const accessToken = 'mockAccessToken';

      // Mock the signIn method of the authService
      jest.spyOn(authService, 'signIn').mockImplementation(async () => ({
        access_token: accessToken,
      }));

      // Call the signIn method of the controller
      const result = await controller.signIn(signInDto);

      // Check if the result contains access token
      expect(result).toEqual({ access_token: accessToken });
    });
  });

  describe('getProfile', () => {
    it('should return user profile with valid access token', async () => {
      const userData = {
        sub: 'asd',
        username: 'asd',
        iat: 123,
        exp: 123,
      };

      // Mock request object with user data
      const mockRequest = { user: userData };

      // Call the getProfile method of the controller with a mock request containing user information
      const result = await controller.getProfile(mockRequest);

      // Check if the result contains user information
      expect(result).toEqual(userData);
    });

    it('should return unauthorized without access token', async () => {
      const mockRequest: Request = {} as Request;

      // Call the getProfile method of the controller with a mock request without user information
      const result = await controller.getProfile(mockRequest);

      // Check if the result is unauthorized (expected behavior for routes protected by AuthGuard)
      expect(result).toBeFalsy();
    });
  });
});
