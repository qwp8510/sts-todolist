import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './entity';
import { TaskAssigneeRepository, TaskRepository } from './repo';
import { TaskAssigneeService, TaskService } from './service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskEntity]),
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
  ],
  exports: [
    'ITaskService',
    'ITaskAssigneeService',
  ],
})
export class TaskModule {}
