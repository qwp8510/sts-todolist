export class Team {
  private _id: number;
  private _name: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: number,
    name: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this._id = id;
    this._name = name;
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || new Date();
  }

  public changeName(newName: string) {
    this._name = newName;
    this._updatedAt = new Date();
  }

  // Getter
  get id() { return this._id; }
  get name() { return this._name; }
  get createdAt() { return this._createdAt; }
  get updatedAt() { return this._updatedAt; }
}

export class TeamMember {
  private _id: number;
  private _teamId: number;
  private _userId: number;
  private _role: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: number,
    teamId: number,
    userId: number,
    role: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this._id = id;
    this._teamId = teamId;
    this._userId = userId;
    this._role = role;
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || new Date();
  }

  public changeRole(newRole: string) {
    this._role = newRole;
    this._updatedAt = new Date();
  }

  // Getter
  get id() { return this._id; }
  get teamId() { return this._teamId; }
  get userId() { return this._userId; }
  get role() { return this._role; }
  get createdAt() { return this._createdAt; }
  get updatedAt() { return this._updatedAt; }
}

