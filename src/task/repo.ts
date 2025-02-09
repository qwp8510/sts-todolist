import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITaskRepository } from './interface';
import { TaskEntity } from './entity';
import { Task } from './model';
import { TaskMapper } from './mapper';

@Injectable()
export class TaskRepository implements ITaskRepository {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly ormRepo: Repository<TaskEntity>,
  ) {}

  async findById(id: number): Promise<Task> {
    const entity = await this.ormRepo.findOne({
      where: { id },
      relations: ['team', 'creator'],
    });
    return TaskMapper.toDomain(entity);
  }

  async findByTeamId(teamId: number): Promise<Task[]> {
    const entities = await this.ormRepo.find({
      where: { team: { id: teamId } },
      relations: ['team', 'creator'],
    });
    return entities.map(TaskMapper.toDomain);
  }

  async findByCreatorId(creatorId: number): Promise<Task[]> {
    const entities = await this.ormRepo.find({
      where: { creator: { id: creatorId } },
      relations: ['team', 'creator'],
    });
    return entities.map(TaskMapper.toDomain);
  }

  async findByParentId(parentId: number): Promise<Task[]> {
    const entities = await this.ormRepo.find({
      where: { parentId },
      relations: ['team', 'creator'],
    });
    return entities.map(TaskMapper.toDomain);
  }

  async create(domain: Task): Promise<Task> {
    const entityToCreate = TaskMapper.toEntity(domain);
    const saved = await this.ormRepo.save(entityToCreate);
    return TaskMapper.toDomain(saved);
  }

  async update(domain: Task): Promise<Task> {
    const entityToUpdate = TaskMapper.toEntity(domain);
    const updated = await this.ormRepo.save(entityToUpdate);
    return TaskMapper.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepo.delete(id);
  }
}
