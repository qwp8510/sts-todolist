import * as bcrypt from 'bcrypt';

export class User {
  public id: number;
  public username: string;
  public password: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(
    id: number,
    username: string,
    password: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  public toResponse(): { id: number; username: string } {
    return {
      id: this.id,
      username: this.username,
    };
  }
}
