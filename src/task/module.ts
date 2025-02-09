import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskAssigneeEntity, TaskEntity, TaskHistoryEntity } from './entity';
import { TaskAssigneeRepository, TaskHistoryRepository, TaskRepository } from './repo';
import { TaskAssigneeService, TaskHistoryService, TaskService } from './service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TaskEntity,
      TaskAssigneeEntity,
      TaskHistoryEntity,
    ]),
  ],
  providers: [
    {
      provide: 'ITaskRepository',
      useClass: TaskRepository,
    },
    {
      provide: 'ITaskService',
      useClass: TaskService,
    },
    {
      provide: 'ITaskAssigneeRepository',
      useClass: TaskAssigneeRepository,
    },
    {
      provide: 'ITaskAssigneeService',
      useClass: TaskAssigneeService,
    },
    {
      provide: 'ITaskHistoryRepository',
      useClass: TaskHistoryRepository,
    },
    {
      provide: 'ITaskHistoryService',
      useClass: TaskHistoryService,
    },
  ],
  exports: [
    'ITaskService',
    'ITaskAssigneeService',
  ],
})
export class TaskModule {}
