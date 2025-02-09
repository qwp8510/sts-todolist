export class Task {
  private _id: number;
  private _teamId: number;
  private _creatorId: number;
  private _parentId: number | null;
  private _title: string;
  private _description: string;
  private _status: string;
  private _dueDate?: Date;
  private _createdAt: Date;
  private _updatedAt: Date;

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
  ) {
    this._id = id;
    this._teamId = teamId;
    this._creatorId = creatorId;
    this._parentId = parentId;
    this._title = title;
    this._description = description;
    this._status = status;
    this._dueDate = dueDate;
    this._createdAt = createdAt ?? new Date();
    this._updatedAt = updatedAt ?? new Date();
  }

  // Getter
  get id() { return this._id; }
  get teamId() { return this._teamId; }
  get creatorId() { return this._creatorId; }
  get parentId() { return this._parentId; }
  get title() { return this._title; }
  get description() { return this._description; }
  get status() { return this._status; }
  get dueDate() { return this._dueDate; }
  get createdAt() { return this._createdAt; }
  get updatedAt() { return this._updatedAt; }

  public completeTask() {
    this._status = 'completed';
    this._updatedAt = new Date();
  }
}

export class TaskAssignee {
  private _id: number;
  private _taskId: number;
  private _userId: number;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: number,
    taskId: number,
    userId: number,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this._id = id;
    this._taskId = taskId;
    this._userId = userId;
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || new Date();
  }

  // Getter
  get id() { return this._id; }
  get taskId() { return this._taskId; }
  get userId() { return this._userId; }
  get createdAt() { return this._createdAt; }
  get updatedAt() { return this._updatedAt; }
}

export class TaskHistory {
  private _id: number;
  private _taskId: number;
  private _userId: number | null;
  private _action: string;
  private _oldValue?: string;
  private _newValue?: string;
  private _comment?: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: number,
    taskId: number,
    userId: number | null,
    action: string,
    oldValue?: string,
    newValue?: string,
    comment?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this._id = id;
    this._taskId = taskId;
    this._userId = userId;
    this._action = action;
    this._oldValue = oldValue;
    this._newValue = newValue;
    this._comment = comment;
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || new Date();
  }

  // Getter
  get id() { return this._id; }
  get taskId() { return this._taskId; }
  get userId() { return this._userId; }
  get action() { return this._action; }
  get oldValue() { return this._oldValue; }
  get newValue() { return this._newValue; }
  get comment() { return this._comment; }
  get createdAt() { return this._createdAt; }
  get updatedAt() { return this._updatedAt; }
}
