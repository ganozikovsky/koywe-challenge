import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';

import { UsersService } from '../users/users.service';

import { AuthService } from './auth.service';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findByUsername: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user (excluding password) when credentials are valid', async () => {
      const mockUser = {
        _id: 'user_id',
        username: 'testuser',
        password: 'hashedPassword',
        toObject: () => ({
          _id: 'user_id',
          username: 'testuser',
          password: 'hashedPassword',
        }),
      };

      mockUsersService.findByUsername.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser(
        'testuser',
        'correctPassword',
      );

      expect(mockUsersService.findByUsername).toHaveBeenCalledWith('testuser');
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'correctPassword',
        'hashedPassword',
      );
      expect(result).toEqual({
        _id: 'user_id',
        username: 'testuser',
      });
    });

    it('should return null when user not found', async () => {
      mockUsersService.findByUsername.mockResolvedValue(null);

      const result = await authService.validateUser(
        'nonexistentuser',
        'password',
      );

      expect(mockUsersService.findByUsername).toHaveBeenCalledWith(
        'nonexistentuser',
      );
      expect(result).toBeNull();
    });

    it('should return null when password is incorrect', async () => {
      const mockUser = {
        _id: 'user_id',
        username: 'testuser',
        password: 'hashedPassword',
        toObject: () => ({
          _id: 'user_id',
          username: 'testuser',
          password: 'hashedPassword',
        }),
      };

      mockUsersService.findByUsername.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await authService.validateUser(
        'testuser',
        'wrongPassword',
      );

      expect(mockUsersService.findByUsername).toHaveBeenCalledWith('testuser');
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'wrongPassword',
        'hashedPassword',
      );
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should create a JWT token with user data', async () => {
      const user = {
        _id: 'user_id',
        username: 'testuser',
      };

      mockJwtService.sign.mockReturnValue('signed_token');

      const result = await authService.login(user);

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        username: 'testuser',
        sub: 'user_id',
      });
      expect(result).toEqual({
        access_token: 'signed_token',
      });
    });
  });
});
