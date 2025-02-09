import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskAssigneeEntity, TaskEntity, TaskHistoryEntity, TaskWatcherEntity } from './entity';
import { TaskAssigneeRepository, TaskHistoryRepository, TaskRepository, TaskWatcherRepository } from './repo';
import { TaskAssigneeService, TaskHistoryService, TaskService, TaskWatcherService } from './service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TaskEntity,
      TaskAssigneeEntity,
      TaskHistoryEntity,
      TaskWatcherEntity,
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
    {
      provide: 'ITaskWatcherRepository',
      useClass: TaskWatcherRepository,
    },
    {
      provide: 'ITaskWatcherService',
      useClass: TaskWatcherService,
    },
  ],
  exports: [
    'ITaskService',
    'ITaskAssigneeService',
    'ITaskHistoryService',
    'ITaskWatcherService',
  ],
})
export class TaskModule {}
