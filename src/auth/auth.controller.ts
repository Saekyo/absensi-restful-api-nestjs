import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth/jwt-auth.guard';
import { TransformPasswordPipe } from './transform.password.pipe';
import { TimeoutInterceptor } from 'src/set-time-out/set-time-out.interceptor';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  /**
   * Constructor
   * @param authService
   */
  constructor(private authService: AuthService) {}

  /**
   * Register controller
   * @param dto
   * @returns
   */
  @UsePipes(ValidationPipe, TransformPasswordPipe)
  @HttpCode(200)
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return await this.authService.register(dto);
  }

  /**
   * Login Controller
   * @param dto
   * @returns
   */
  @HttpCode(200)
  @UseInterceptors(TimeoutInterceptor)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto);
  }

  /**
   * Get detail User
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile() {
    return {
      message: 'Profile',
    };
  }
}
