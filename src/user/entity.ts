import { TaskEntity, TaskAssigneeEntity, TaskHistoryEntity, TaskWatcherEntity } from 'src/task/entity';
import { TeamMemberEntity } from 'src/team/entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationship with tasks: tasks created by the user
  @OneToMany(() => TaskEntity, task => task.creator)
  tasks: TaskEntity[];

  // Relationship with teams: teams the user belongs to
  @OneToMany(() => TeamMemberEntity, teamMember => teamMember.user)
  teamMembers: TeamMemberEntity[];

  // Tasks assigned to the user
  @OneToMany(() => TaskAssigneeEntity, taskAssignee => taskAssignee.user)
  taskAssignees: TaskAssigneeEntity[];

  // Tasks watched by the user
  @OneToMany(() => TaskWatcherEntity, taskWatcher => taskWatcher.user)
  taskWatchers: TaskWatcherEntity[];

  // Task history records (actions or comments made by the user)
  @OneToMany(() => TaskHistoryEntity, taskHistory => taskHistory.user)
  taskHistories: TaskHistoryEntity[];
}
