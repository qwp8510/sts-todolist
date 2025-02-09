import { UserEntity } from "./entity";
import { User } from "./model";


export class UserMapper {
  public static toDomain(entity: UserEntity): User {
    if (!entity) {
      return null;
    }
    return new User(
      entity.id,
      entity.username,
      entity.password,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  public static toEntity(domain: User): UserEntity {
    const entity = new UserEntity();
    entity.id = domain.id;
    entity.username = domain.username;
    entity.password = domain.password;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
