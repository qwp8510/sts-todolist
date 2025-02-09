import { Controller, Get, Param, Post, Body, Inject } from '@nestjs/common';
import { User } from './model';
import { IUserService } from './interface';

@Controller('users')
export class UserController {
  constructor(
    @Inject('IUserService')
    private readonly userService: IUserService,
  ) {}

  @Get(':id')
  async getUser(@Param('id') id: number): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Post()
  async createUser(@Body() body: { username: string; password: string }): Promise<User> {
    const user = new User(null, body.username, body.password);
    return this.userService.createUser(user);
  }
}
