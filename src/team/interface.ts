import { Team, TeamMember } from "./model";

export interface ITeamRepository {
  findById(id: number): Promise<Team>;
  findAll(): Promise<Team[]>;
  findAllForUser(userId: number): Promise<Team[]>;
  create(team: Team): Promise<Team>;
  update(team: Team): Promise<Team>;
  delete(id: number): Promise<void>;
}

export interface ITeamService {
  getTeamById(id: number): Promise<Team>;
  getAllTeams(): Promise<Team[]>;
  createTeam(team: Team): Promise<Team>;
  updateTeam(team: Team): Promise<Team>;

  createTeamForUser(name: string, userId: number): Promise<Team>;
  getAllTeamsForUser(userId: number): Promise<Team[]>;
  deleteTeam(teamId: number, userId: number);
  inviteUser(teamId: number, ownerId: number, username: string);
  getTeamWithMembers(teamId: number, userId: number): Promise<{ team: Team, members: TeamMember[] }>;
}

export interface ITeamMemberRepository {
  findById(id: number): Promise<TeamMember>;
  findByTeamId(teamId: number): Promise<TeamMember[]>;
  findByUserId(userId: number): Promise<TeamMember[]>;
  create(teamMember: TeamMember): Promise<TeamMember>;
  update(teamMember: TeamMember): Promise<TeamMember>;
  delete(id: number): Promise<void>;
}

export interface ITeamMemberService {
  getTeamMemberById(id: number): Promise<TeamMember>;
  getTeamMembersByTeam(teamId: number): Promise<TeamMember[]>;
  getTeamMembersByUser(userId: number): Promise<TeamMember[]>;
  createTeamMember(teamMember: TeamMember): Promise<TeamMember>;
  updateTeamMember(teamMember: TeamMember): Promise<TeamMember>;
  deleteTeamMember(id: number): Promise<void>;

  getTeamMemberByTeamAndUser(teamId: number, userId: number): Promise<TeamMember>
}
