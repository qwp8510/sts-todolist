import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserRepository } from './interface';
import { User } from './model';
import { UserMapper } from './mapper';
import { UserEntity } from './entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userOrmRepository: Repository<UserEntity>,
  ) {}

  async findById(id: number): Promise<User> {
    const entity = await this.userOrmRepository.findOne({ where: { id } });
    return UserMapper.toDomain(entity);
  }

  async findByUsername(username: string): Promise<User> {
    const entity = await this.userOrmRepository.findOne({ where: { username } });
    return UserMapper.toDomain(entity);
  }

  async create(domainUser: User): Promise<User> {
    const entityToCreate = UserMapper.toEntity(domainUser);
    const savedEntity = await this.userOrmRepository.save(entityToCreate);
    return UserMapper.toDomain(savedEntity);
  }

  async update(domainUser: User): Promise<User> {
    const entityToUpdate = UserMapper.toEntity(domainUser);
    const updatedEntity = await this.userOrmRepository.save(entityToUpdate);
    return UserMapper.toDomain(updatedEntity);
  }

  async delete(id: number): Promise<void> {
    await this.userOrmRepository.delete(id);
  }
}
