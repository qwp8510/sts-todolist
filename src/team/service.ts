import { Injectable, Inject } from '@nestjs/common';
import { ITeamMemberRepository, ITeamMemberService, ITeamRepository, ITeamService } from './interface';
import { Team, TeamMember } from './model';

@Injectable()
export class TeamService implements ITeamService {
  constructor(
    @Inject('ITeamRepository')
    private readonly teamRepo: ITeamRepository,
  ) {}

  async getTeamById(id: number): Promise<Team> {
    return this.teamRepo.findById(id);
  }

  async getAllTeams(): Promise<Team[]> {
    return this.teamRepo.findAll();
  }

  async createTeam(team: Team): Promise<Team> {
    // 可在此加入業務邏輯，例如檢查重複名稱
    return this.teamRepo.create(team);
  }

  async updateTeam(team: Team): Promise<Team> {
    // 業務檢查
    return this.teamRepo.update(team);
  }

  async deleteTeam(id: number): Promise<void> {
    return this.teamRepo.delete(id);
  }
}

@Injectable()
export class TeamMemberService implements ITeamMemberService {
  constructor(
    @Inject('ITeamMemberRepository')
    private readonly teamMemberRepo: ITeamMemberRepository,
  ) {}

  async getTeamMemberById(id: number): Promise<TeamMember> {
    return this.teamMemberRepo.findById(id);
  }

  async getTeamMembersByTeam(teamId: number): Promise<TeamMember[]> {
    return this.teamMemberRepo.findByTeamId(teamId);
  }

  async getTeamMembersByUser(userId: number): Promise<TeamMember[]> {
    return this.teamMemberRepo.findByUserId(userId);
  }

  async createTeamMember(teamMember: TeamMember): Promise<TeamMember> {
    // TODO: check member in team
    return this.teamMemberRepo.create(teamMember);
  }

  async updateTeamMember(teamMember: TeamMember): Promise<TeamMember> {
    // TODO: check role permission
    return this.teamMemberRepo.update(teamMember);
  }

  async deleteTeamMember(id: number): Promise<void> {
    return this.teamMemberRepo.delete(id);
  }
}
