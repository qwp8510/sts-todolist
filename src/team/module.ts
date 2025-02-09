import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamEntity, TeamMemberEntity } from './entity';
import { TeamMemberRepository, TeamRepository } from './repo';
import { TeamMemberService, TeamService } from './service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TeamEntity]),
    TypeOrmModule.forFeature([TeamMemberEntity]),
  ],
  providers: [
    {
      provide: 'ITeamRepository',
      useClass: TeamRepository,
    },
    {
      provide: 'ITeamMemberRepository',
      useClass: TeamMemberRepository,
    },
    {
      provide: 'ITeamService',
      useClass: TeamService,
    },
    {
      provide: 'ITeamMemberService',
      useClass: TeamMemberService,
    },
  ],
  exports: [
    'ITeamService',
    'ITeamMemberService',
  ],
})
export class TeamModule {}
