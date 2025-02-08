import { Module } from '@nestjs/common';
import { TasksController } from './controller';

@Module({
  imports: [],
  controllers: [TasksController],
  providers: [],
})
export class TasksModule {}
