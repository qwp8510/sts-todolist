import { TeamEntity, TeamMemberEntity } from "src/team/entity";
import { Team, TeamMember } from "./model";


export class TeamMapper {
  static toDomain(entity: TeamEntity): Team {
    if (!entity) return null;
    return new Team(
      entity.id,
      entity.name,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toEntity(domain: Team): TeamEntity {
    const entity = new TeamEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}

export class TeamMemberMapper {
  static toDomain(entity: TeamMemberEntity): TeamMember {
    if (!entity) return null;
    return new TeamMember(
      entity.id,
      entity.team?.id,
      entity.user?.id,
      entity.role,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toEntity(domain: TeamMember): TeamMemberEntity {
    const entity = new TeamMemberEntity();
    entity.id = domain.id;
    entity.team = { id: domain.teamId } as any;
    entity.user = { id: domain.userId } as any;
    entity.role = domain.role;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
