import { User } from "src/user/model";

export class Task {
  public id: number;
  public teamId: number;
  public creatorId: number;
  public parentId: number | null;
  public title: string;
  public description: string;
  public status: string;
  public dueDate?: Date;
  public createdAt: Date;
  public updatedAt: Date;
  public children: Task[];
  public assignees: TaskAssignee[];
  public watchers: TaskWatcher[];
  public histories: TaskHistory[];

  constructor(
    id: number,
    teamId: number,
    creatorId: number,
    parentId: number | null,
    title: string,
    description: string,
    status: string,
    dueDate?: Date,
    createdAt?: Date,
    updatedAt?: Date,
    children?: Task[],
    assignees?: TaskAssignee[],
    watchers?: TaskWatcher[],
    histories?: TaskHistory[],
  ) {
    this.id = id;
    this.teamId = teamId;
    this.creatorId = creatorId;
    this.parentId = parentId;
    this.title = title;
    this.description = description;
    this.status = status;
    this.dueDate = dueDate;
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();
    this.children = children ?? [];
    this.assignees = assignees ?? [];
    this.watchers = watchers ?? [];
    this.histories = histories ?? [];
  }

  public completeTask() {
    this.status = 'completed';
    this.updatedAt = new Date();
  }
}

export class TaskAssignee {
  public id: number;
  public taskId: number;
  public userId: number;
  public user?: User;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(
    id: number,
    taskId: number,
    userId: number,
    createdAt?: Date,
    updatedAt?: Date,
    user?: User,
  ) {
    this.id = id;
    this.taskId = taskId;
    this.userId = userId;
    this.user = user;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  toResponse() {
    return {
      id: this.id,
      taskId: this.taskId,
      userId: this.userId,
      user: this.user.toResponse(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}

export class TaskHistory {
  public id: number;
  public taskId: number;
  public userId: number | null;
  public user?: User;
  public action: string;
  public comment?: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(
    id: number,
    taskId: number,
    userId: number | null,
    action: string,
    comment?: string,
    createdAt?: Date,
    updatedAt?: Date,
    user?: User,
  ) {
    this.id = id;
    this.taskId = taskId;
    this.userId = userId;
    this.user = user;
    this.action = action;
    this.comment = comment;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  toResponse() {
    return {
      id: this.id,
      taskId: this.taskId,
      userId: this.userId,
      user: this.user?.toResponse() || null,
      action: this.action,
      comment: this.comment,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}

export class TaskWatcher {
  public id: number;
  public taskId: number;
  public userId: number;
  public user?: User;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(
    id: number,
    taskId: number,
    userId: number,
    createdAt?: Date,
    updatedAt?: Date,
    user?: User,
  ) {
    this.id = id;
    this.taskId = taskId;
    this.userId = userId;
    this.user = user;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  toResponse() {
    return {
      id: this.id,
      taskId: this.taskId,
      userId: this.userId,
      user: this.user?.toResponse() || null,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}
