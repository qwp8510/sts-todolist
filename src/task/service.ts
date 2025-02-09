import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ITaskAssigneeRepository, ITaskAssigneeService, ITaskRepository, ITaskService } from './interface';
import { Task, TaskAssignee } from './model';


@Injectable()
export class TaskService implements ITaskService {
  constructor(
    @Inject('ITaskRepository')
    private readonly taskRepo: ITaskRepository,
  ) {}

  async getTaskById(id: number): Promise<Task> {
    return this.taskRepo.findById(id);
  }

  async getTasksByTeam(teamId: number): Promise<Task[]> {
    return this.taskRepo.findByTeamId(teamId);
  }

  async getTasksByCreator(creatorId: number): Promise<Task[]> {
    return this.taskRepo.findByCreatorId(creatorId);
  }

  async getSubTasks(parentId: number): Promise<Task[]> {
    return this.taskRepo.findByParentId(parentId);
  }

  async createTask(task: Task): Promise<Task> {
    // check teamId, creatorId exist
    return this.taskRepo.create(task);
  }

  async updateTask(task: Task): Promise<Task> {
    return this.taskRepo.update(task);
  }

  async deleteTask(id: number): Promise<void> {
    // TODO: check children task
    return this.taskRepo.delete(id);
  }

  async completeTask(id: number): Promise<Task> {
    const task = await this.taskRepo.findById(id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    task.completeTask();

    return this.taskRepo.update(task);
  }
}

@Injectable()
export class TaskAssigneeService implements ITaskAssigneeService {
  constructor(
    @Inject('ITaskAssigneeRepository')
    private readonly repo: ITaskAssigneeRepository,
  ) {}

  async getById(id: number): Promise<TaskAssignee> {
    return this.repo.findById(id);
  }

  async getByTask(taskId: number): Promise<TaskAssignee[]> {
    return this.repo.findByTask(taskId);
  }

  async getByUser(userId: number): Promise<TaskAssignee[]> {
    return this.repo.findByUser(userId);
  }

  async create(assignee: TaskAssignee): Promise<TaskAssignee> {
    // TODO: check user was assigned
    return this.repo.create(assignee);
  }

  async update(assignee: TaskAssignee): Promise<TaskAssignee> {
    return this.repo.update(assignee);
  }

  async delete(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
