import { TaskAssigneeEntity, TaskEntity, TaskHistoryEntity } from "./entity";
import { Task, TaskAssignee, TaskHistory } from "./model";

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

export class TaskHistoryMapper {
  static toDomain(entity: TaskHistoryEntity): TaskHistory {
    if (!entity) return null;
    return new TaskHistory(
      entity.id,
      entity.task?.id,
      entity.user?.id ?? null,
      entity.action,
      entity.oldValue,
      entity.newValue,
      entity.comment,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toEntity(domain: TaskHistory): TaskHistoryEntity {
    const entity = new TaskHistoryEntity();
    entity.id = domain.id;
    entity.task = { id: domain.taskId } as any;
    entity.user = domain.userId ? ({ id: domain.userId } as any) : null;
    entity.action = domain.action;
    entity.oldValue = domain.oldValue;
    entity.newValue = domain.newValue;
    entity.comment = domain.comment;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
