import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    const result = await this.authService.register(body.username, body.password);
    return {
      token: result.token,
      user: result.user.toResponse(),
    }
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const result = await this.authService.login(body.email, body.password);
    return {
      token: result.token,
      user: result.user.toResponse(),
    }
  }
}
