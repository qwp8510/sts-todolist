import { Controller, Get, Post, Patch, Delete, Param, Body, Inject } from '@nestjs/common';
import { ITeamService } from './interface';
import { Team } from './model';

@Controller('teams')
export class TeamController {
  constructor(
    @Inject('ITeamService')
    private readonly teamService: ITeamService,
  ) {}

  @Get()
  async getAllTeams(): Promise<Team[]> {
    return this.teamService.getAllTeams();
  }

  @Get(':id')
  async getTeamById(@Param('id') id: number): Promise<Team> {
    return this.teamService.getTeamById(id);
  }

  @Post()
  async createTeam(@Body() dto: { name: string }): Promise<Team> {
    const team = new Team(null, dto.name);
    return this.teamService.createTeam(team);
  }

  @Patch(':id')
  async updateTeam(@Param('id') id: number, @Body() dto: { name?: string }): Promise<Team> {
    const existingTeam = await this.teamService.getTeamById(id);
    if (!existingTeam) {
      // TODO: throw error
      throw new Error(`Team with id ${id} not found`);
    }
    if (dto.name) {
      existingTeam.changeName(dto.name);
    }
    return this.teamService.updateTeam(existingTeam);
  }

  @Delete(':id')
  async deleteTeam(@Param('id') id: number): Promise<void> {
    return this.teamService.deleteTeam(id);
  }
}
