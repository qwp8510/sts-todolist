import { Controller, Get, Post, Patch, Delete, Param, Body, Inject, Request, Query, UseGuards } from '@nestjs/common';
import { ITaskService } from './interface';
import { Task } from './model';
import { ClientException } from 'src/errors';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(
    @Inject('ITaskService')
    private readonly taskService: ITaskService,
  ) {}

  @Post()
  async createTask(
    @Body() dto: {
      teamId: number;
      parentTaskId?: number;
      title: string;
      description?: string;
      dueDate?: Date;
    },
    @Request() req,
  ): Promise<Task> {
    const userId = req.user.id;
    return this.taskService.createTask({
      teamId: dto.teamId,
      creatorId: userId,
      parentTaskId: dto.parentTaskId,
      title: dto.title,
      description: dto.description,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
    });
  }

  @Patch(':id')
  async updateTask(@Param('id') taskId: number, @Body() dto: {
    title?: string;
    description?: string;
    dueDate?: string;

    addAssignees?: number[];
    removeAssignees?: number[];

    addWatchers?: number[];
    removeWatchers?: number[];

    status?: string; // 'open', 'completed', 'archived'

    comment?: string;
  }, @Request() req) {
    const userId = req.user.id;
    return this.taskService.updateTask(taskId, userId, {
      title: dto.title,
      description: dto.description,
      dueDate: dto.dueDate,
      addAssignees: dto.addAssignees || [],
      removeAssignees: dto.removeAssignees || [],
      addWatchers: dto.addWatchers || [],
      removeWatchers: dto.removeWatchers || [],
      status: dto.status,
      comment: dto.comment,
    });
  }

  @Delete(':id')
  async deleteTask(@Param('id') taskId: number, @Request() req) {
    const userId = req.user.id;
    await this.taskService.deleteTask(taskId, userId);
    return { success: true };
  }

  /**
   * (4) get tasks
   *   Query Params:
   *    - teamId (required)
   *    - dueDateStart / dueDateEnd
   *    - creatorId
   *    - assigneeId
   *    - watcherId
   *    - status
   *    - sortBy: 'createdAt'(default) | 'dueDate' | 'creator'
   *    - sortOrder: 'ASC' | 'DESC' (default: 'ASC')
  */
  @Get()
  async getTasks(@Query() query, @Request() req) {
    const userId = req.user.id;
    const {
      teamId,
      dueDateStart,
      dueDateEnd,
      creatorId,
      assigneeId,
      watcherId,
      status,
      sortBy = 'createdAt',
      sortOrder = 'ASC',
    } = query;

    if (!teamId) {
      throw new ClientException("team_id_missing", "teamId is required");
    }

    return this.taskService.getTasks({
      userId,
      teamId: Number(teamId),
      dueDateStart: dueDateStart ? new Date(dueDateStart) : undefined,
      dueDateEnd: dueDateEnd ? new Date(dueDateEnd) : undefined,
      creatorId: creatorId ? Number(creatorId) : undefined,
      assigneeId: assigneeId ? Number(assigneeId) : undefined,
      watcherId: watcherId ? Number(watcherId) : undefined,
      status,
      sortBy,
      sortOrder: sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
    });
  }

  @Get(':id')
  async getTaskDetail(@Param('id') taskId: number, @Request() req) {
    const userId = req.user.id;
    return this.taskService.getTaskDetail(taskId, userId);
  }
}
