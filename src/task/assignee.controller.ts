import { Controller, Get, Post, Patch, Delete, Param, Body, Inject } from '@nestjs/common';
import { ITaskAssigneeService } from './interface';
import { TaskAssignee } from './model';

@Controller('task-assignees')
export class TaskAssigneeController {
  constructor(
    @Inject('ITaskAssigneeService')
    private readonly taskAssigneeService: ITaskAssigneeService,
  ) {}

  @Get(':id')
  async getById(@Param('id') id: number) {
    return this.taskAssigneeService.getById(id);
  }

  @Get('task/:taskId')
  async getByTask(@Param('taskId') taskId: number) {
    return this.taskAssigneeService.getByTask(taskId);
  }

  @Get('user/:userId')
  async getByUser(@Param('userId') userId: number) {
    return this.taskAssigneeService.getByUser(userId);
  }

  @Post()
  async create(@Body() dto: { taskId: number; userId: number }) {
    const assignee = new TaskAssignee(null, dto.taskId, dto.userId);
    return this.taskAssigneeService.create(assignee);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: { taskId?: number; userId?: number }) {
    const existing = await this.taskAssigneeService.getById(id);
    if (dto.taskId) {
      // 簡單起見，直接重建 domain model
      return this.taskAssigneeService.update(
        new TaskAssignee(id, dto.taskId, dto.userId ?? existing.userId, existing.createdAt, existing.updatedAt),
      );
    }
    if (dto.userId) {
      return this.taskAssigneeService.update(
        new TaskAssignee(id, existing.taskId, dto.userId, existing.createdAt, existing.updatedAt),
      );
    }
    return existing;
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.taskAssigneeService.delete(id);
  }
}
