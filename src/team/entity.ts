import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { TaskEntity } from 'src/task/entity';
import { UserEntity } from 'src/user/entity';

@Entity('teams')
export class TeamEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column()
  name: string;

  // Members of the team
  @OneToMany(() => TeamMemberEntity, teamMember => teamMember.team)
  members: TeamMemberEntity[];

  // Tasks under the team
  @OneToMany(() => TaskEntity, task => task.team)
  tasks: TaskEntity[];
}

@Entity('team_members')
export class TeamMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TeamEntity, team => team.members, { onDelete: 'CASCADE' })
  team: TeamEntity;

  @ManyToOne(() => UserEntity, user => user.teamMembers, { onDelete: 'CASCADE' })
  user: UserEntity;

  // Role can be used to distinguish between owner, member, etc.
  @Column({ length: 20 })
  role: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

