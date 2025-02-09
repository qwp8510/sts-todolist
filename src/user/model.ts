import * as bcrypt from 'bcrypt';

export class User {
  private _id: number;
  private _username: string;
  private _password: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: number,
    username: string,
    password: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this._id = id;
    this._username = username;
    this._password = password;
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || new Date();
  }

  // Getter / Setter
  get id(): number { return this._id; }
  get username(): string { return this._username; }
  get password(): string { return this._password; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  set password(newPassword: string) {
    this._password = bcrypt.hashSync(newPassword, 10);
  }

  public toResponse(): Partial<User> {
    return {
      id: this._id,
      username: this._username,
    };
  }
}
