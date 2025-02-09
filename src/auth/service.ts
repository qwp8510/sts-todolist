import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ClientException } from 'src/errors';
import { IUserService } from 'src/user/interface';
import { User } from 'src/user/model';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('IUserService')
    private readonly userService: IUserService,
  ) {}

  /**
   * Registers a new user
   */
  async register(username: string, password: string): Promise<{ token: string; user: User }> {
    // Checks if the user with the same email already exists
    const existingUser = await this.userService.getUserByUsername(username);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hashes the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User(null, username, hashedPassword);
    const createdUser = await this.userService.createUser(newUser);
    // JWT token payload
    const payload = { sub: createdUser.id, userID: createdUser.id, username: createdUser.username };
    const token = this.jwtService.sign(payload);
    return { token, user: createdUser };
  }

  /**
   * User login
   */
  async login(username: string, password: string): Promise<{ token: string; user: User }> {
    const user = await this.userService.getUserByUsername(username);
    if (!user) {
      throw new ClientException("user_not_exist", 'user not exist');
    }

    // Compares the password (original password and hashed password)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ClientException("password_error", 'password error');
    }
    const payload = { sub: user.id, userID: user.id, username: user.username };
    const token = this.jwtService.sign(payload);
    return { token, user };
  }

  /**
   * Validates the JWT payload and returns the corresponding user data
   */
  async validateUser(payload: any): Promise<User> {
    return this.userService.getUserById(payload.userID);
  }
}

