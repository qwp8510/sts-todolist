import { ApiProperty } from "@nestjs/swagger";
import { UserResponse } from "src/user/dto";

export class CreateTaskDto {
  @ApiProperty({
    description: 'team id',
    required: true
  })
  teamId: number;

  @ApiProperty()
  parentTaskId?: number;

  @ApiProperty({
    description: 'title',
    minimum: 1,
  })
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  dueDate?: Date;
}

export class TaskAssigneeResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  taskId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty({ required: false })
  createdAt?: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;

  @ApiProperty({ type: UserResponse })
  user: UserResponse;
}

export class TaskWatcherResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  taskId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty({ required: false })
  createdAt?: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;

  @ApiProperty({ type: UserResponse })
  user: UserResponse;
}

export class TaskHistoryResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  taskId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  action: string;
  
  @ApiProperty({ required: false })
  comment?: string;

  @ApiProperty({ required: false })
  createdAt?: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;

  @ApiProperty({ type: UserResponse })
  user: UserResponse;
}

export class TaskResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  teamId: number;

  @ApiProperty()
  creatorId: number;

  @ApiProperty({ required: false })
  parentId: number | null;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  status: string;

  @ApiProperty({ required: false })
  dueDate?: Date;

  @ApiProperty({ required: false })
  createdAt?: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;

  // @ApiProperty({ required: false })
  // children?: TaskResponse[];

  // @ApiProperty({ required: false, type: [TaskAssigneeResponse] })
  // assignees?: TaskAssigneeResponse[];

  // @ApiProperty({ required: false, type: [TaskWatcherResponse] })
  // watchers?: TaskWatcherResponse[];

  // @ApiProperty({ required: false, type: [TaskHistoryResponse] })
  // histories?: TaskHistoryResponse[];
}

export class UpdateTaskDto {
  @ApiProperty({ required: false })
  title?: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  dueDate?: string;

  @ApiProperty({ required: false })
  addAssignees?: number[];

  @ApiProperty({ required: false })
  removeAssignees?: number[];

  @ApiProperty({ required: false })
  addWatchers?: number[];

  @ApiProperty({ required: false })
  removeWatchers?: number[];

  @ApiProperty({ required: false })
  status?: string;

  @ApiProperty({ required: false })
  comment?: string;
}

export class GetTaskDetailResponse {
  @ApiProperty()
  task: TaskResponse;

  @ApiProperty()
  children: TaskResponse[];

  @ApiProperty({ required: false, type: [TaskAssigneeResponse] })
  assignees?: TaskAssigneeResponse[];

  @ApiProperty({ required: false, type: [TaskWatcherResponse] })
  watchers?: TaskWatcherResponse[];

  @ApiProperty({ required: false, type: [TaskHistoryResponse] })
  history?: TaskHistoryResponse[];
}
