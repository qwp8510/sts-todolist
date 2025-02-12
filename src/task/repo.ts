import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITaskAssigneeRepository, ITaskHistoryRepository, ITaskRepository, ITaskWatcherRepository } from './interface';
import { TaskAssigneeEntity, TaskEntity, TaskHistoryEntity, TaskWatcherEntity } from './entity';
import { Task, TaskAssignee, TaskHistory, TaskWatcher } from './model';
import { TaskAssigneeMapper, TaskHistoryMapper, TaskMapper, TaskWatcherMapper } from './mapper';

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


  async findTasksByFilters(params: {
    teamId: number;
    dueDateStart?: Date;
    dueDateEnd?: Date;
    creatorId?: number;
    assigneeId?: number;
    watcherId?: number;
    status?: string;
    sortBy?: string;  // 'createdAt' | 'dueDate' | 'creator'
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<Task[]> {
    const qb = this.ormRepo
      .createQueryBuilder('task')
      .where('task.team_id = :teamId', { teamId: params.teamId });
  
    if (params.dueDateStart) {
      qb.andWhere('task.due_date >= :start', { start: params.dueDateStart });
    }
    if (params.dueDateEnd) {
      qb.andWhere('task.due_date <= :end', { end: params.dueDateEnd });
    }
  
    if (params.creatorId) {
      qb.andWhere('task.creator_id = :creatorId', { creatorId: params.creatorId });
    }
  
    if (params.assigneeId) {
      // JOIN task_assignees
      qb.innerJoin('task_assignees', 'ta', 'ta.task_id = task.id')
        .andWhere('ta.user_id = :assigneeId', { assigneeId: params.assigneeId });
    }
  
    if (params.watcherId) {
      // JOIN task_watchers
      qb.innerJoin('task_watchers', 'tw', 'tw.task_id = task.id')
        .andWhere('tw.user_id = :watcherId', { watcherId: params.watcherId });
    }
  
    if (params.status) {
      qb.andWhere('task.status = :status', { status: params.status });
    }
  
    // sort
    let orderField: string;
    switch (params.sortBy) {
      case 'dueDate':
        orderField = 'task.due_date';
        break;
      case 'creator':
        orderField = 'task.creator_id';
        break;
      default:
        orderField = 'task.created_at';
    }
    qb.orderBy(orderField, params.sortOrder);
  
    const entities = await qb.getMany();
    return entities.map(TaskMapper.toDomain);
  }

  async findDetailById(taskId: number): Promise<Task> {
    const entity = await this.ormRepo.findOne({
      where: { id: taskId },
      relations: [
        'children',
        'assignees',
        'watchers',
        'histories',
      ],
    });
    return TaskMapper.toDomain(entity);
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

  async findOneByTaskAndUser(taskId: number, userId: number): Promise<TaskAssignee> {
    const entity = await this.ormRepo.findOne({
      where: { task: { id: taskId }, user: { id: userId } },
      relations: ['task', 'user'],
    });
    return TaskAssigneeMapper.toDomain(entity);
  }
}

@Injectable()
export class TaskHistoryRepository implements ITaskHistoryRepository {
  constructor(
    @InjectRepository(TaskHistoryEntity)
    private readonly ormRepo: Repository<TaskHistoryEntity>,
  ) {}

  async findById(id: number): Promise<TaskHistory> {
    const entity = await this.ormRepo.findOne({
      where: { id },
      relations: ['task', 'user'],
    });
    return TaskHistoryMapper.toDomain(entity);
  }

  async findByTaskId(taskId: number): Promise<TaskHistory[]> {
    const entities = await this.ormRepo.find({
      where: { task: { id: taskId } },
      relations: ['task', 'user'],
      order: { createdAt: 'ASC' },
    });
    return entities.map(TaskHistoryMapper.toDomain);
  }

  async create(history: TaskHistory): Promise<TaskHistory> {
    const toSave = TaskHistoryMapper.toEntity(history);
    const saved = await this.ormRepo.save(toSave);
    return TaskHistoryMapper.toDomain(saved);
  }
}

@Injectable()
export class TaskWatcherRepository implements ITaskWatcherRepository {
  constructor(
    @InjectRepository(TaskWatcherEntity)
    private readonly ormRepo: Repository<TaskWatcherEntity>,
  ) {}

  async findById(id: number): Promise<TaskWatcher> {
    const entity = await this.ormRepo.findOne({
      where: { id },
      relations: ['task', 'user'],
    });
    return TaskWatcherMapper.toDomain(entity);
  }

  async findByTask(taskId: number): Promise<TaskWatcher[]> {
    const entities = await this.ormRepo.find({
      where: { task: { id: taskId } },
      relations: ['task', 'user'],
    });
    return entities.map(TaskWatcherMapper.toDomain);
  }

  async findByUser(userId: number): Promise<TaskWatcher[]> {
    const entities = await this.ormRepo.find({
      where: { user: { id: userId } },
      relations: ['task', 'user'],
    });
    return entities.map(TaskWatcherMapper.toDomain);
  }

  async create(domain: TaskWatcher): Promise<TaskWatcher> {
    const toSave = TaskWatcherMapper.toEntity(domain);
    const saved = await this.ormRepo.save(toSave);
    return TaskWatcherMapper.toDomain(saved);
  }

  async update(domain: TaskWatcher): Promise<TaskWatcher> {
    const toUpdate = TaskWatcherMapper.toEntity(domain);
    const updated = await this.ormRepo.save(toUpdate);
    return TaskWatcherMapper.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepo.delete(id);
  }

  async findOneByTaskAndUser(taskId: number, userId: number): Promise<TaskWatcher> {
    const entity = await this.ormRepo.findOne({
      where: { task: { id: taskId }, user: { id: userId } },
      relations: ['task', 'user'],
    });
    return TaskWatcherMapper.toDomain(entity);
  }
}
