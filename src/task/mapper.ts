import { TaskEntity } from "./entity";
import { Task } from "./model";

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
