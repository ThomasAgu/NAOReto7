import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

describe('AuthController', () => {
  let authController: AuthController;
  const mockAuthService = {
    register: jest.fn((dto) => {
      return {
        id: Date.now(),
        ...dto,
      };
    }),
    login: jest.fn((dto) => {
      return {
        access_token: 'token-value',
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('registerUser', () => {
    it('should register a user', () => {
      const registerDto: RegisterAuthDto = {
        username: 'testuser',
        password: 'password123',
      };

      expect(authController.registerUser(registerDto)).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          username: 'testuser',
          password: 'password123',
        })
      );
    });
  });

  describe('loginUser', () => {
    it('should log in a user', () => {
      const loginDto: LoginAuthDto = {
        username: 'testuser',
        password: 'password123',
      };

      expect(authController.loginUser(loginDto)).toEqual(
        expect.objectContaining({
          access_token: 'token-value',
        })
      );
    });
  });
});
