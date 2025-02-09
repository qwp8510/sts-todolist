import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository, IUserService } from './interface';
import { User } from './model';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async getUserById(id: number): Promise<User> {
    return this.userRepository.findById(id);
  }

  async getUserByUsername(value: string): Promise<User> {
    return this.userRepository.findByUsername(value);
  }

  async createUser(user: User): Promise<User> {
    return this.userRepository.create(user);
  }

  async updateUser(user: User): Promise<User> {
    // TODO: validate user
    return this.userRepository.update(user);
  }

  async deleteUser(id: number): Promise<void> {
    return this.userRepository.delete(id);
  }
}
