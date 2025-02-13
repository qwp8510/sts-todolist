import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './service';
import { AuthDto, AuthResponse } from './dto';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOkResponse({
    description: 'register user',
    type: AuthResponse,
  })
  async register(@Body() body: AuthDto): Promise<AuthResponse> {
    const result = await this.authService.register(body.username, body.password);
    return {
      token: result.token,
      user: result.user.toResponse(),
    }
  }

  @Post('login')
  @ApiOkResponse({
    description: 'login user',
    type: AuthResponse,
  })
  async login(@Body() body: AuthDto): Promise<AuthResponse> {
    const result = await this.authService.login(body.username, body.password);
    return {
      token: result.token,
      user: result.user.toResponse(),
    }
  }
}
