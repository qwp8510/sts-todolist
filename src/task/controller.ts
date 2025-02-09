import { Controller, Get, Post, Patch, Delete, Param, Body, Inject } from '@nestjs/common';
import { ITaskService } from './interface';
import { Task } from './model';

@Controller('tasks')
export class TaskController {
  constructor(
    @Inject('ITaskService')
    private readonly taskService: ITaskService,
  ) {}

  @Get(':id')
  async getTask(@Param('id') id: number): Promise<Task> {
    return this.taskService.getTaskById(id);
  }

  @Get('team/:teamId')
  async getTasksByTeam(@Param('teamId') teamId: number): Promise<Task[]> {
    return this.taskService.getTasksByTeam(teamId);
  }

  @Get('creator/:creatorId')
  async getTasksByCreator(@Param('creatorId') creatorId: number): Promise<Task[]> {
    return this.taskService.getTasksByCreator(creatorId);
  }

  @Get(':id/subtasks')
  async getSubTasks(@Param('id') id: number): Promise<Task[]> {
    return this.taskService.getSubTasks(id);
  }

  @Post()
  async createTask(@Body() dto: {
    teamId: number;
    creatorId: number;
    parentId?: number;
    title: string;
    description?: string;
    dueDate?: Date;
  }): Promise<Task> {
    const task = new Task(
      null,
      dto.teamId,
      dto.creatorId,
      dto.parentId ?? null,
      dto.title,
      dto.description ?? '',
      'open',
      dto.dueDate,
    );
    return this.taskService.createTask(task);
  }

  @Patch(':id')
  async updateTask(@Param('id') id: number, @Body() dto: Partial<{
    title: string;
    description: string;
    status: string;
    dueDate: Date;
    isRecurring: boolean;
    recurrenceRule: string;
    nextRunTime: Date;
  }>) {
    const existing = await this.taskService.getTaskById(id);
    if (!existing) {
      // TODO: throw error
    }
    const updated = new Task(
      id,
      existing.teamId,
      existing.creatorId,
      existing.parentId,
      dto.title ?? existing.title,
      dto.description ?? existing.description,
      dto.status ?? existing.status,
      dto.dueDate ?? existing.dueDate,
    );
    return this.taskService.updateTask(updated);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: number) {
    return this.taskService.deleteTask(id);
  }

  @Patch(':id/complete')
  async completeTask(@Param('id') id: number) {
    return this.taskService.completeTask(id);
  }
}
