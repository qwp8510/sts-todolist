import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamEntity, TeamMemberEntity } from './entity';
import { TeamMemberRepository, TeamRepository } from './repo';
import { TeamMemberService, TeamService } from './service';
import { UserModule } from 'src/user/module';
import { TeamController } from './controller';
import { TeamMemberController } from './member.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([TeamEntity]),
    TypeOrmModule.forFeature([TeamMemberEntity]),
    UserModule
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
  controllers: [TeamController, TeamMemberController],
  exports: [
    'ITeamService',
    'ITeamMemberService',
  ],
})
export class TeamModule {}
