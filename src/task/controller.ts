import { Controller, Get, Post, Patch, Delete, Param, Body, Inject, Request, Query, UseGuards } from '@nestjs/common';
import { ITaskService } from './interface';
import { Task } from './model';
import { ClientException } from 'src/errors';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateTaskDto, GetTaskDetailResponse, TaskResponse, UpdateTaskDto } from './dto';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(
    @Inject('ITaskService')
    private readonly taskService: ITaskService,
  ) {}

  @Post()
  @ApiOkResponse({
    description: 'create task',
    type: TaskResponse,
  })
  async createTask(
    @Body() dto: CreateTaskDto,
    @Request() req,
  ): Promise<TaskResponse> {
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
  async updateTask(@Param('id') taskId: number, @Body() dto: UpdateTaskDto, @Request() req) {
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
  @ApiOkResponse({
    description: 'get tasks',
    type: TaskResponse,
    isArray: true,
  })
  async getTasks(@Query() query, @Request() req): Promise<TaskResponse[]> {
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
  @ApiOkResponse({
    description: 'get tasks',
    type: GetTaskDetailResponse,
  })
  async getTaskDetail(@Param('id') taskId: number, @Request() req): Promise<GetTaskDetailResponse> {
    const userId = req.user.id;
    const detail = await this.taskService.getTaskDetail(taskId, userId);
    return {
      task: detail.task,
      children: detail.children,
      assignees: detail.assignees.map(assignee => assignee.toResponse()),
      watchers: detail.watchers.map(watcher => watcher.toResponse()),
      history: detail.history.map(history => history.toResponse()),
    }
  }
}
