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
