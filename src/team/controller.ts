import { Controller, Get, Post, Delete, Param, Body, Inject, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ITeamService } from './interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateTeamDto, GetTeamByIdResponse, GetTeamsResponse, InviteUserToTeamDto } from './dto';

@ApiTags('teams')
@Controller('teams')
@UseGuards(JwtAuthGuard)
export class TeamController {
  constructor(
    @Inject('ITeamService')
    private readonly teamService: ITeamService,
  ) {}

  @Get()
  @ApiOkResponse({
    description: 'get all team list',
    type: GetTeamsResponse,
    isArray: true,
  })
  async getAllTeams(@Request() req): Promise<GetTeamsResponse[]> {
    const userId = req.user.id;
    const teams = await this.teamService.getAllTeamsForUser(userId);
    return teams;
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'get team by id',
    type: GetTeamByIdResponse,
  })
  async getTeamById(@Param('id') teamId: number, @Request() req): Promise<GetTeamByIdResponse>  {
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
  @ApiOkResponse({
    description: 'create team',
    type: GetTeamsResponse,
  })
  async createTeam(@Body() body: CreateTeamDto, @Request() req): Promise<GetTeamsResponse> {
    const user = req.user;
    return await this.teamService.createTeamForUser(body.name, user.id);
  }

  @Post(':id/invite')
  async inviteUserToTeam(
    @Param('id') teamId: number,
    @Body() body: InviteUserToTeamDto,
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
