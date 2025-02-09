import { Injectable, Inject } from '@nestjs/common';
import { ITeamMemberRepository, ITeamMemberService, ITeamRepository, ITeamService } from './interface';
import { Team, TeamMember } from './model';
import { IUserService } from 'src/user/interface';
import { ClientException } from 'src/errors';

@Injectable()
export class TeamService implements ITeamService {
  constructor(
    @Inject('ITeamRepository')
    private readonly teamRepo: ITeamRepository,
    @Inject('ITeamMemberService')
    private readonly teamMemberService: ITeamMemberService,
    @Inject('IUserService')
    private readonly userService: IUserService,
  ) {}

  async getTeamById(id: number): Promise<Team> {
    return this.teamRepo.findById(id);
  }

  async getAllTeams(): Promise<Team[]> {
    return this.teamRepo.findAll();
  }

  async createTeam(team: Team): Promise<Team> {
    return this.teamRepo.create(team);
  }

  async createTeamForUser(name: string, userId: number): Promise<Team> {
    const newTeam = new Team(null, name);
    const createdTeam = await this.createTeam(newTeam);

    const teamMember = new TeamMember(null, createdTeam.id, userId, 'owner');
    await this.teamMemberService.createTeamMember(teamMember);

    return createdTeam;
  }

  async updateTeam(team: Team): Promise<Team> {
    return this.teamRepo.update(team);
  }

  async getAllTeamsForUser(userId: number): Promise<Team[]> {
    return this.teamRepo.findAllForUser(userId);
  }

  async deleteTeam(teamId: number, userId: number) {
    const member = await this.teamMemberService.getTeamMemberByTeamAndUser(teamId, userId);
    if (!member || member.role !== 'owner') {
      throw new ClientException("delete_not_team_owner", 'Only owner can delete team');
    }

    await this.teamRepo.delete(teamId);
  }

  async inviteUser(teamId: number, ownerId: number, username: string) {
    const ownerMember = await this.teamMemberService.getTeamMemberByTeamAndUser(teamId, ownerId);
    if (!ownerMember) {
      throw new ClientException("invite_team_not_member", 'you are not team member');
    }

    // check user exist
    const userToInvite = await this.userService.getUserByUsername(username);
    if (!userToInvite) {
      throw new ClientException("user_not_exist", 'User does not exist');
    }

    const existingMember = await this.teamMemberService.getTeamMemberByTeamAndUser(teamId, userToInvite.id);
    if (existingMember) {
      throw new ClientException("user_already_in_team", 'User already in the team');
    }

    const newMember = new TeamMember(null, teamId, userToInvite.id, 'member');
    await this.teamMemberService.createTeamMember(newMember);

    return;
  }

  async getTeamWithMembers(teamId: number, userId: number) {
    const member = await this.teamMemberService.getTeamMemberByTeamAndUser(teamId, userId);
    if (!member) {
      throw new ClientException("not_team_member", 'you are not team member');
    }

    const team = await this.teamRepo.findById(teamId);
    if (!team) {
      throw new ClientException("team_not_exist", 'team not exist');
    }

    const allMembers = await this.teamMemberService.getTeamMembersByTeam(teamId);
    return {
      team: team,
      members: allMembers,
    };
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

  async getTeamMemberByTeamAndUser(teamId: number, userId: number): Promise<TeamMember> {
    const members = await this.teamMemberRepo.findByTeamId(teamId);
    return members.find(m => m.userId === userId);
  }
}
