import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ITaskRepository, ITaskService } from './interface';
import { Task } from './model';


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
