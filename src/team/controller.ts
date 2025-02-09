import { Controller, Get, Post, Delete, Param, Body, Inject, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ITeamService } from './interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('teams')
@UseGuards(JwtAuthGuard)
export class TeamController {
  constructor(
    @Inject('ITeamService')
    private readonly teamService: ITeamService,
  ) {}

  @Get()
  async getAllTeams(@Request() req) {
    const userId = req.user.id;
    const teams = await this.teamService.getAllTeamsForUser(userId);
    return teams;
  }

  @Get(':id')
  async getTeamById(@Param('id') teamId: number, @Request() req) {
    const userId = req.user.id;
    const teamInfo = await this.teamService.getTeamWithMembers(teamId, userId);
    if (!teamInfo) {
      throw new ForbiddenException('You are not in this team or team not found');
    }

    return {
      team: teamInfo.team,
      members: teamInfo.members.map(m => m.toResponse()),
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTeam(@Body() body: { name: string }, @Request() req) {
    const user = req.user;
    return await this.teamService.createTeamForUser(body.name, user.id);
  }

  @Post(':id/invite')
  async inviteUserToTeam(
    @Param('id') teamId: number,
    @Body() body: { username: string },
    @Request() req,
  ) {
    const ownerId = req.user.id;
    return this.teamService.inviteUser(teamId, ownerId, body.username);
  }

  @Delete(':id')
  async deleteTeam(@Param('id') teamId: number, @Request() req) {
    const userId = req.user.id;
    await this.teamService.deleteTeam(teamId, userId);

    return { success: true };
  }
}
