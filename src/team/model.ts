import { User } from "src/user/model";
import { GetTeamMemberResponse } from "./dto";

export class Team {
  public id: number;
  public name: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(
    id: number,
    name: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.name = name;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  public changeName(newName: string) {
    this.name = newName;
    this.updatedAt = new Date();
  }
}

export class TeamMember {
  public id: number;
  public teamId: number;
  public userId: number;
  public user?: User;
  public role: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(
    id: number,
    teamId: number,
    userId: number,
    role: string,
    createdAt?: Date,
    updatedAt?: Date,
    user?: User,
  ) {
    this.id = id;
    this.teamId = teamId;
    this.userId = userId;
    this.user = user;
    this.role = role;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  public changeRole(newRole: string) {
    this.role = newRole;
    this.updatedAt = new Date();
  }

  toResponse(): GetTeamMemberResponse {
    return {
      id: this.id,
      teamId: this.teamId,
      userId: this.userId,
      user: this.user.toResponse(),
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}

