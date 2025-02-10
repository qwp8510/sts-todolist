import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamEntity, TeamMemberEntity } from './entity';
import { TeamMemberRepository, TeamRepository } from './repo';
import { TeamMemberService, TeamService } from './service';
import { UserModule } from 'src/user/module';
import { TeamController } from './controller';

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
  controllers: [TeamController],
  exports: [
    'ITeamService',
    'ITeamMemberService',
  ],
})
export class TeamModule {}
