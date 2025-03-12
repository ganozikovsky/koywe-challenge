import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiResponseDecorator } from 'src/common';
import { User } from 'src/users/schemas/user.schema';

import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';

import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Register a new user
   *
   * @param {CreateUserDto} createUserDto
   * @return {*}
   * @memberof AuthController
   */
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponseDecorator({
    type: User,
    description: 'User successfully registered',
  })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * Authenticate user and get token
   *
   * @param {LoginDto} loginDto
   * @return {*}
   * @memberof AuthController
   */
  @Post('login')
  @ApiOperation({ summary: 'Authenticate user and get token' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.authService.login(user);
  }
}
