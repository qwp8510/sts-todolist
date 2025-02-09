import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITaskAssigneeRepository, ITaskRepository } from './interface';
import { TaskAssigneeEntity, TaskEntity } from './entity';
import { Task, TaskAssignee } from './model';
import { TaskAssigneeMapper, TaskMapper } from './mapper';

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

@Injectable()
export class TaskAssigneeRepository implements ITaskAssigneeRepository {
  constructor(
    @InjectRepository(TaskAssigneeEntity)
    private readonly ormRepo: Repository<TaskAssigneeEntity>,
  ) {}

  async findById(id: number): Promise<TaskAssignee> {
    const entity = await this.ormRepo.findOne({
      where: { id },
      relations: ['task', 'user'],
    });
    return TaskAssigneeMapper.toDomain(entity);
  }

  async findByTask(taskId: number): Promise<TaskAssignee[]> {
    const entities = await this.ormRepo.find({
      where: { task: { id: taskId } },
      relations: ['task', 'user'],
    });
    return entities.map(TaskAssigneeMapper.toDomain);
  }

  async findByUser(userId: number): Promise<TaskAssignee[]> {
    const entities = await this.ormRepo.find({
      where: { user: { id: userId } },
      relations: ['task', 'user'],
    });
    return entities.map(TaskAssigneeMapper.toDomain);
  }

  async create(domain: TaskAssignee): Promise<TaskAssignee> {
    const toSave = TaskAssigneeMapper.toEntity(domain);
    const saved = await this.ormRepo.save(toSave);
    return TaskAssigneeMapper.toDomain(saved);
  }

  async update(domain: TaskAssignee): Promise<TaskAssignee> {
    const toUpdate = TaskAssigneeMapper.toEntity(domain);
    const updated = await this.ormRepo.save(toUpdate);
    return TaskAssigneeMapper.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepo.delete(id);
  }
}
