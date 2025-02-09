import { Controller, Get, Post, Patch, Delete, Param, Body, Inject } from '@nestjs/common';
import { ITeamMemberService } from './interface';
import { TeamMember } from './model';

@Controller('team-members')
export class TeamMemberController {
  constructor(
    @Inject('ITeamMemberService')
    private readonly teamMemberService: ITeamMemberService,
  ) {}

  @Get(':id')
  async getTeamMember(@Param('id') id: number): Promise<TeamMember> {
    return this.teamMemberService.getTeamMemberById(id);
  }

  @Get('team/:teamId')
  async getByTeam(@Param('teamId') teamId: number) {
    return this.teamMemberService.getTeamMembersByTeam(teamId);
  }

  @Get('user/:userId')
  async getByUser(@Param('userId') userId: number) {
    return this.teamMemberService.getTeamMembersByUser(userId);
  }

  @Post()
  async createTeamMember(@Body() dto: { teamId: number; userId: number; role: string }) {
    const member = new TeamMember(null, dto.teamId, dto.userId, dto.role);
    return this.teamMemberService.createTeamMember(member);
  }

  @Patch(':id')
  async updateTeamMember(@Param('id') id: number, @Body() dto: { role?: string }) {
    const member = await this.teamMemberService.getTeamMemberById(id);
    if (dto.role) {
      member.changeRole(dto.role);
    }
    return this.teamMemberService.updateTeamMember(member);
  }

  @Delete(':id')
  async deleteTeamMember(@Param('id') id: number) {
    return this.teamMemberService.deleteTeamMember(id);
  }
}
