import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_HOST, DB_NAME, DB_PORT, DB_PWD, DB_USERNAME } from './config';
import { TaskModule } from './task/module';
import { TeamModule } from './team/module';
import { UserModule } from './user/module';
import { AuthModule } from './auth/module';
import { TaskAssigneeEntity, TaskEntity, TaskHistoryEntity, TaskWatcherEntity } from './task/entity';
import { TeamEntity, TeamMemberEntity } from './team/entity';
import { UserEntity } from './user/entity';

process.env.TZ = 'UTC';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: DB_HOST,
      port: DB_PORT,
      username: DB_USERNAME,
      password: DB_PWD,
      database: DB_NAME,
      entities: [
        TaskEntity,
        TaskAssigneeEntity,
        TaskWatcherEntity,
        TaskHistoryEntity,
        TeamMemberEntity,
        TeamEntity,
        UserEntity,
      ],
      synchronize: false,
    }),
  ],
})
export class DbModule {}

@Module({
  imports: [
    DbModule,
    TaskModule,
    TeamModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
