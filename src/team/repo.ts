import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITeamMemberRepository, ITeamRepository } from './interface';
import { TeamEntity, TeamMemberEntity } from './entity';
import { Team, TeamMember } from './model';
import { TeamMapper, TeamMemberMapper } from './mapper';


@Injectable()
export class TeamRepository implements ITeamRepository {
  constructor(
    @InjectRepository(TeamEntity)
    private readonly ormRepository: Repository<TeamEntity>,
  ) {}

  async findById(id: number): Promise<Team> {
    const entity = await this.ormRepository.findOne({ where: { id } });
    return TeamMapper.toDomain(entity);
  }

  async findAll(): Promise<Team[]> {
    const entities = await this.ormRepository.find();
    return entities.map(TeamMapper.toDomain);
  }

  async create(domain: Team): Promise<Team> {
    const entityToCreate = TeamMapper.toEntity(domain);
    const saved = await this.ormRepository.save(entityToCreate);
    return TeamMapper.toDomain(saved);
  }

  async update(domain: Team): Promise<Team> {
    const entityToUpdate = TeamMapper.toEntity(domain);
    const updated = await this.ormRepository.save(entityToUpdate);
    return TeamMapper.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }
}

@Injectable()
export class TeamMemberRepository implements ITeamMemberRepository {
  constructor(
    @InjectRepository(TeamMemberEntity)
    private readonly ormRepo: Repository<TeamMemberEntity>,
  ) {}

  async findById(id: number): Promise<TeamMember> {
    const entity = await this.ormRepo.findOne({
      where: { id },
      relations: ['team', 'user'],
    });
    return TeamMemberMapper.toDomain(entity);
  }

  async findByTeamId(teamId: number): Promise<TeamMember[]> {
    const entities = await this.ormRepo.find({
      where: { team: { id: teamId } },
      relations: ['team', 'user'],
    });
    return entities.map(TeamMemberMapper.toDomain);
  }

  async findByUserId(userId: number): Promise<TeamMember[]> {
    const entities = await this.ormRepo.find({
      where: { user: { id: userId } },
      relations: ['team', 'user'],
    });
    return entities.map(TeamMemberMapper.toDomain);
  }

  async create(domain: TeamMember): Promise<TeamMember> {
    const entityToCreate = TeamMemberMapper.toEntity(domain);
    const saved = await this.ormRepo.save(entityToCreate);
    return TeamMemberMapper.toDomain(saved);
  }

  async update(domain: TeamMember): Promise<TeamMember> {
    const entityToUpdate = TeamMemberMapper.toEntity(domain);
    const updated = await this.ormRepo.save(entityToUpdate);
    return TeamMemberMapper.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepo.delete(id);
  }
}
