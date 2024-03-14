import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthLoginDto, AuthRegisterDto } from '../dto/auth.dto';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() authRegisterDto: AuthRegisterDto) {
    const data = await this.authService.register(authRegisterDto);
    return { data };
  }

  @Post('login')
  async login(@Body() authLoginDto: AuthLoginDto) {
    const data = await this.authService.login(authLoginDto);
    return { data };
  }
  @UseGuards(JwtAuthGuard)
  @Get('test-login')
  async testLgin(@Req() req) {
    return { user: req.user };
  }
}
