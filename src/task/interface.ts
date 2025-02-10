import { Task, TaskAssignee, TaskHistory, TaskWatcher } from "./model";


export interface ITaskRepository {
  findById(id: number): Promise<Task>;
  findByTeamId(teamId: number): Promise<Task[]>;
  findByCreatorId(creatorId: number): Promise<Task[]>;
  create(task: Task): Promise<Task>;
  update(task: Task): Promise<Task>;
  delete(id: number): Promise<void>;

  findByParentId(parentId: number): Promise<Task[]>;
  findTasksByFilters(params: {
    teamId: number;
    dueDateStart?: Date;
    dueDateEnd?: Date;
    creatorId?: number;
    assigneeId?: number;
    watcherId?: number;
    status?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<Task[]> 
}

export interface ITaskService {
  getTaskById(id: number): Promise<Task>;
  getTasksByTeam(teamId: number): Promise<Task[]>;
  getTasksByCreator(creatorId: number): Promise<Task[]>;
  getSubTasks(parentId: number): Promise<Task[]>;

  createTask(input: {
    teamId: number;
    creatorId: number;
    parentTaskId?: number;
    title: string;
    description?: string;
    dueDate?: Date;
  }): Promise<Task>;
  updateTask(
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
      status?: string;
      comment?: string;
    },
  ): Promise<void>;
  getTasks(input: {
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
  }): Promise<Task[]>
  getTaskDetail(
    taskId: number, userId: number,
  ): Promise<{task: Task, children: Task[], assignees: TaskAssignee[], watchers: TaskWatcher[], history: TaskHistory[]}>;
  deleteTask(taskId: number, userId: number): Promise<void>;
}

export interface ITaskAssigneeRepository {
  findById(id: number): Promise<TaskAssignee>;
  findByTask(taskId: number): Promise<TaskAssignee[]>;
  findByUser(userId: number): Promise<TaskAssignee[]>;
  create(entity: TaskAssignee): Promise<TaskAssignee>;
  update(entity: TaskAssignee): Promise<TaskAssignee>;
  delete(id: number): Promise<void>;

  findOneByTaskAndUser(taskId: number, userId: number): Promise<TaskAssignee>;
}

export interface ITaskAssigneeService {
  getById(id: number): Promise<TaskAssignee>;
  getByTask(taskId: number): Promise<TaskAssignee[]>;
  getByUser(userId: number): Promise<TaskAssignee[]>;
  create(assignee: TaskAssignee): Promise<TaskAssignee>;
  update(assignee: TaskAssignee): Promise<TaskAssignee>;
  delete(id: number): Promise<void>;

  createAssigneeIfNotExist(taskId: number, userId: number): Promise<void>;
  removeAssigneeIfExist(taskId: number, userId: number): Promise<void>;
}

export interface ITaskHistoryRepository {
  findById(id: number): Promise<TaskHistory>;
  findByTaskId(taskId: number): Promise<TaskHistory[]>;
  create(history: TaskHistory): Promise<TaskHistory>;
}

export interface ITaskHistoryService {
  getById(id: number): Promise<TaskHistory>;
  getByTaskId(taskId: number): Promise<TaskHistory[]>;
  create(history: TaskHistory): Promise<TaskHistory>;
}

export interface ITaskWatcherRepository {
  findById(id: number): Promise<TaskWatcher>;
  findByTask(taskId: number): Promise<TaskWatcher[]>;
  findByUser(userId: number): Promise<TaskWatcher[]>;
  create(watcher: TaskWatcher): Promise<TaskWatcher>;
  update(watcher: TaskWatcher): Promise<TaskWatcher>;
  delete(id: number): Promise<void>;

  findOneByTaskAndUser(taskId: number, userId: number): Promise<TaskWatcher>;
}

export interface ITaskWatcherService {
  getById(id: number): Promise<TaskWatcher>;
  getByTask(taskId: number): Promise<TaskWatcher[]>;
  getByUser(userId: number): Promise<TaskWatcher[]>;
  create(watcher: TaskWatcher): Promise<TaskWatcher>;
  update(watcher: TaskWatcher): Promise<TaskWatcher>;
  delete(id: number): Promise<void>;

  createWatcherIfNotExist(taskId: number, userId: number): Promise<void>;
  removeWatcherIfExist(taskId: number, userId: number): Promise<void>;
}
