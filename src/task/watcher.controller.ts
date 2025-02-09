import { Controller, Get, Post, Patch, Delete, Param, Body, Inject } from '@nestjs/common';
import { ITaskWatcherService } from './interface';
import { TaskWatcher } from './model';

@Controller('task-watchers')
export class TaskWatcherController {
  constructor(
    @Inject('ITaskWatcherService')
    private readonly taskWatcherService: ITaskWatcherService,
  ) {}

  @Get(':id')
  async getById(@Param('id') id: number) {
    return this.taskWatcherService.getById(id);
  }

  @Get('task/:taskId')
  async getByTask(@Param('taskId') taskId: number) {
    return this.taskWatcherService.getByTask(taskId);
  }

  @Get('user/:userId')
  async getByUser(@Param('userId') userId: number) {
    return this.taskWatcherService.getByUser(userId);
  }

  @Post()
  async create(@Body() dto: { taskId: number; userId: number }) {
    const watcher = new TaskWatcher(null, dto.taskId, dto.userId);
    return this.taskWatcherService.create(watcher);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: { taskId?: number; userId?: number }) {
    const existing = await this.taskWatcherService.getById(id);
    return this.taskWatcherService.update(
      new TaskWatcher(
        id,
        dto.taskId ?? existing.taskId,
        dto.userId ?? existing.userId,
        existing.createdAt,
        existing.updatedAt,
      ),
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.taskWatcherService.delete(id);
  }
}
