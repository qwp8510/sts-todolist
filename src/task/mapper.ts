import { TaskAssigneeEntity, TaskEntity } from "./entity";
import { Task, TaskAssignee } from "./model";

export class TaskMapper {
  static toDomain(entity: TaskEntity): Task {
    if (!entity) return null;
    return new Task(
      entity.id,
      entity.team?.id,
      entity.creator?.id,
      entity.parentId,
      entity.title,
      entity.description,
      entity.status,
      entity.dueDate,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toEntity(domain: Task): TaskEntity {
    const entity = new TaskEntity();
    entity.id = domain.id;
    entity.team = { id: domain.teamId } as any;
    entity.creator = { id: domain.creatorId } as any;
    entity.parentId = domain.parentId;
    entity.title = domain.title;
    entity.description = domain.description;
    entity.status = domain.status;
    entity.dueDate = domain.dueDate;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}

export class TaskAssigneeMapper {
  static toDomain(entity: TaskAssigneeEntity): TaskAssignee {
    if (!entity) return null;
    return new TaskAssignee(
      entity.id,
      entity.task?.id,
      entity.user?.id,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toEntity(domain: TaskAssignee): TaskAssigneeEntity {
    const entity = new TaskAssigneeEntity();
    entity.id = domain.id;
    entity.task = { id: domain.taskId } as any;
    entity.user = { id: domain.userId } as any;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
