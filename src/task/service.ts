import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ITaskAssigneeRepository, ITaskAssigneeService, ITaskHistoryRepository, ITaskHistoryService, ITaskRepository, ITaskService, ITaskWatcherRepository, ITaskWatcherService } from './interface';
import { Task, TaskAssignee, TaskHistory, TaskWatcher } from './model';
import { ITeamMemberService } from 'src/team/interface';
import { ClientException } from 'src/errors';


@Injectable()
export class TaskService implements ITaskService {
  constructor(
    @Inject('ITaskRepository')
    private readonly taskRepo: ITaskRepository,
    @Inject('ITeamMemberService')
    private readonly teamMemberService: ITeamMemberService,
    @Inject('ITaskAssigneeService')
    private readonly taskAssigneeService: ITaskAssigneeService,
    @Inject('ITaskWatcherService')
    private readonly taskWatcherService: ITaskWatcherService,
    @Inject('ITaskHistoryService')
    private readonly taskHistoryService: ITaskHistoryService,
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

  async createTask(input: {
    teamId: number;
    creatorId: number;
    parentTaskId?: number;
    title: string;
    description?: string;
    dueDate?: Date;
  }): Promise<Task> {
    // check team membership
    const member = await this.teamMemberService.getTeamMemberByTeamAndUser(input.teamId, input.creatorId);
    if (!member) {
      throw new ClientException("not_team_member", "You are not a member of this team");
    }

    // check parentTask
    let parentId: number = null;
    if (input.parentTaskId) {
      const parentTask = await this.taskRepo.findById(input.parentTaskId);
      if (!parentTask) {
        throw new ClientException("parent_not_exist", "Parent task does not exist");
      }
      parentId = parentTask.id;
    }

    const newTask = new Task(
      null,
      input.teamId,
      input.creatorId,
      parentId,
      input.title,
      input.description || '',
      'open', // default open
      input.dueDate || null,
    );
    const createdTask = await this.taskRepo.create(newTask);

    // write history: action = CREATE
    await this.taskHistoryService.create(new TaskHistory(
      null,
      createdTask.id,
      input.creatorId,
      'CREATE',
      null,
      null,
    ));

    return createdTask;
  }

  async updateTask(
    taskId: number,
    userId: number,
    updateData: {
      title?: string;
      description?: string;
      dueDate?: string;
      addAssignees?: number[];
      removeAssignees?: number[];
      addWatchers?: number[];
      removeWatchers?: number[];
      status?: string; // 'open', 'completed', 'archived'
      comment?: string;
    },
  ): Promise<void> {
    const task = await this.taskRepo.findById(taskId);
    if (!task) {
      throw new ClientException("task_not_found", "Task not found");
    }

    // check team member
    const member = await this.teamMemberService.getTeamMemberByTeamAndUser(task.teamId, userId);
    if (!member) {
      throw new ClientException("not_team_member", "You are not a member of this team");
    }

    if (updateData.title !== undefined) {
      task.title = updateData.title;
    }
    if (updateData.description !== undefined) {
      task.description = updateData.description;
    }
    if (updateData.dueDate !== undefined) {
      task.dueDate = updateData.dueDate ? new Date(updateData.dueDate) : null;
    }

    // add/remove assignees
    if (updateData.addAssignees && updateData.addAssignees.length) {
      for (const uid of updateData.addAssignees) {
        await this.taskAssigneeService.createAssigneeIfNotExist(taskId, uid);
      }
    }
    if (updateData.removeAssignees && updateData.removeAssignees.length) {
      for (const uid of updateData.removeAssignees) {
        await this.taskAssigneeService.removeAssigneeIfExist(taskId, uid);
      }
    }

    // add/remove watchers
    if (updateData.addWatchers && updateData.addWatchers.length) {
      for (const uid of updateData.addWatchers) {
        await this.taskWatcherService.createWatcherIfNotExist(taskId, uid);
      }
    }
    if (updateData.removeWatchers && updateData.removeWatchers.length) {
      for (const uid of updateData.removeWatchers) {
        await this.taskWatcherService.removeWatcherIfExist(taskId, uid);
      }
    }

    // update task status
    if (updateData.status) {
      const validStatuses = ['open', 'completed', 'archived'];
      if (!validStatuses.includes(updateData.status)) {
        throw new ClientException("invalid_status", "Status must be open|completed|archived");
      }
      task.status = updateData.status;

      // if update to completed, check if there is a parent => 
      // if all child tasks are completed, then parent task is automatically completed
      if (task.status === 'completed' && task.parentId) {
        await this.checkAndCompleteParentIfAllChildrenDone(task.parentId, task.id);
      }
    }

    const updatedTask = await this.taskRepo.update(task);

    // new comment
    if (updateData.comment) {
      await this.taskHistoryService.create(new TaskHistory(
        null,
        updatedTask.id,
        userId,
        'COMMENT',
        updateData.comment,
        null,
        null,
      ));
    }

    await this.taskHistoryService.create(new TaskHistory(
      null,
      updatedTask.id,
      userId,
      'UPDATE',
      null,
      null,
      null,
    ));
  }

  /**
   * If all child tasks under a parent are completed, then set the parent to completed
   */
  private async checkAndCompleteParentIfAllChildrenDone(parentId: number, currentId: number) {
    const children = await this.taskRepo.findByParentId(parentId);
    const allDone = children.every(c => c.id === currentId || c.status === 'completed' || c.status === 'archived');
    if (!allDone) return;

    const parent = await this.taskRepo.findById(parentId);
    if (!parent) return;

    parent.status = 'completed';
    await this.taskRepo.update(parent);

    if (parent.parentId) {
      await this.checkAndCompleteParentIfAllChildrenDone(parent.parentId, parent.id);
    }
  }

  async deleteTask(taskId: number, userId: number): Promise<void> {
    const task = await this.taskRepo.findById(taskId);
    if (!task) {
      throw new ClientException("task_not_found", "Task not found");
    }

    const member = await this.teamMemberService.getTeamMemberByTeamAndUser(task.teamId, userId);
    if (!member) {
      throw new ClientException("not_team_member", "You are not a member of this team");
    }
    await this.taskRepo.delete(taskId);
  }

  async getTasks(input: {
    userId: number;
    teamId: number;
    dueDateStart?: Date;
    dueDateEnd?: Date;
    creatorId?: number;
    assigneeId?: number;
    watcherId?: number;
    status?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<Task[]> {
    const member = await this.teamMemberService.getTeamMemberByTeamAndUser(input.teamId, input.userId);
    if (!member) {
      throw new ClientException("not_team_member", "You are not a member of this team");
    }
    return this.taskRepo.findTasksByFilters(input);
  }

  async getTaskDetail(
    taskId: number, userId: number,
  ): Promise<{task: Task, children: Task[], assignees: TaskAssignee[], watchers: TaskWatcher[], history: TaskHistory[]}> {
    const task = await this.taskRepo.findDetailById(taskId); // 新增的方法
    if (!task) {
      throw new ClientException("task_not_found", "Task not found");
    }

    const member = await this.teamMemberService.getTeamMemberByTeamAndUser(task.teamId, userId);
    if (!member) {
      throw new ClientException("not_team_member", "You are not a member of this team");
    }

    return {
      task,
      children: task.children,
      assignees: task.assignees,
      watchers: task.watchers,
      history: task.histories,
    };
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
    return this.repo.create(assignee);
  }

  async createAssigneeIfNotExist(taskId: number, userId: number) {
    const existing = await this.repo.findOneByTaskAndUser(taskId, userId);
    if (existing) {
      return;
    }

    const newAssignee = new TaskAssignee(null, taskId, userId);
    await this.create(newAssignee);
  }
  

  async update(assignee: TaskAssignee): Promise<TaskAssignee> {
    return this.repo.update(assignee);
  }

  async delete(id: number): Promise<void> {
    return this.repo.delete(id);
  }

  async removeAssigneeIfExist(taskId: number, userId: number) {
    const existing = await this.repo.findOneByTaskAndUser(taskId, userId);
    if (!existing) {
      return;
    }

    await this.delete(existing.id);
  }
}

@Injectable()
export class TaskHistoryService implements ITaskHistoryService {
  constructor(
    @Inject('ITaskHistoryRepository')
    private readonly repo: ITaskHistoryRepository,
  ) {}

  async getById(id: number): Promise<TaskHistory> {
    return this.repo.findById(id);
  }

  async getByTaskId(taskId: number): Promise<TaskHistory[]> {
    return this.repo.findByTaskId(taskId);
  }

  async create(history: TaskHistory): Promise<TaskHistory> {
    return this.repo.create(history);
  }
}

@Injectable()
export class TaskWatcherService implements ITaskWatcherService {
  constructor(
    @Inject('ITaskWatcherRepository')
    private readonly repo: ITaskWatcherRepository,
  ) {}

  async getById(id: number): Promise<TaskWatcher> {
    return this.repo.findById(id);
  }

  async getByTask(taskId: number): Promise<TaskWatcher[]> {
    return this.repo.findByTask(taskId);
  }

  async getByUser(userId: number): Promise<TaskWatcher[]> {
    return this.repo.findByUser(userId);
  }

  async create(watcher: TaskWatcher): Promise<TaskWatcher> {
    return this.repo.create(watcher);
  }

  async createWatcherIfNotExist(taskId: number, userId: number) {
    const existing = await this.repo.findOneByTaskAndUser(taskId, userId);
    if (existing) {
      return;
    }

    const newWatcher= new TaskWatcher(null, taskId, userId);
    await this.create(newWatcher);
  }
  

  async update(watcher: TaskWatcher): Promise<TaskWatcher> {
    return this.repo.update(watcher);
  }

  async delete(id: number): Promise<void> {
    return this.repo.delete(id);
  }

  async removeWatcherIfExist(taskId: number, userId: number) {
    const existing = await this.repo.findOneByTaskAndUser(taskId, userId);
    if (!existing) {
      return;
    }

    await this.delete(existing.id);
  }
}
