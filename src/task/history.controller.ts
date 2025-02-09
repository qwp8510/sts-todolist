import { Controller, Get, Post, Param, Body, Inject } from '@nestjs/common';
import { ITaskHistoryService } from './interface';
import { TaskHistory } from './model';

@Controller('task-history')
export class TaskHistoryController {
  constructor(
    @Inject('ITaskHistoryService')
    private readonly taskHistoryService: ITaskHistoryService,
  ) {}

  @Get(':id')
  async getById(@Param('id') id: number) {
    return this.taskHistoryService.getById(id);
  }

  @Get('task/:taskId')
  async getByTaskId(@Param('taskId') taskId: number) {
    return this.taskHistoryService.getByTaskId(taskId);
  }

  @Post()
  async create(@Body() dto: {
    taskId: number;
    userId?: number; 
    action: string;
    oldValue?: string;
    newValue?: string;
    comment?: string;
  }) {
    const history = new TaskHistory(
      null,
      dto.taskId,
      dto.userId ?? null,
      dto.action,
      dto.comment,
    );
    return this.taskHistoryService.create(history);
  }
}
