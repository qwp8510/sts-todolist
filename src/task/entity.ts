import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from 'src/user/entity';
import { TeamEntity } from 'src/team/entity';

@Entity('tasks')
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Belongs to team
  @ManyToOne(() => TeamEntity, team => team.tasks)
  team: TeamEntity;

  // Created by user
  @ManyToOne(() => UserEntity, user => user.tasks)
  @JoinColumn({ name: 'creator_id' })
  creator: UserEntity;

  @Column({ name: 'parent_id', type: 'int', nullable: true })
  parentId: number | null;

  // Parent task (if no parent, then NULL)
  @ManyToOne(() => TaskEntity, task => task.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: TaskEntity;

  // Child tasks
  @OneToMany(() => TaskEntity, task => task.parent)
  children: TaskEntity[];

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Example: 'open', 'in_progress', 'completed', 'archived'
  @Column({ length: 20 })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  dueDate: Date;

  // Task assignees
  @OneToMany(() => TaskAssigneeEntity, taskAssignee => taskAssignee.task)
  assignees: TaskAssigneeEntity[];

  // Task watchers
  @OneToMany(() => TaskWatcherEntity, taskWatcher => taskWatcher.task)
  watchers: TaskWatcherEntity[];

  // Task histories (including comments)
  @OneToMany(() => TaskHistoryEntity, taskHistory => taskHistory.task)
  histories: TaskHistoryEntity[];
}

@Entity('task_assignees')
export class TaskAssigneeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TaskEntity, task => task.assignees, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task: TaskEntity;

  @ManyToOne(() => UserEntity, user => user.taskAssignees, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

@Entity('task_history')
export class TaskHistoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TaskEntity, task => task.histories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task: TaskEntity;

  // Operator (if system action, user can also set to nullable)
  @ManyToOne(() => UserEntity, user => user.taskHistories, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  // Record action type, for example: 'CREATE', 'UPDATE', 'COMMENT'
  @Column({ length: 50 })
  action: string;

  // Store the value before the change (can use JSON string)
  @Column({ type: 'text', nullable: true })
  oldValue: string;

  // Store the value after the change (can use JSON string)
  @Column({ type: 'text', nullable: true })
  newValue: string;

  // If comment, store the comment content
  @Column({ type: 'text', nullable: true })
  comment: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

@Entity('task_watchers')
export class TaskWatcherEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => TaskEntity, task => task.watchers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task: TaskEntity;

  @ManyToOne(() => UserEntity, user => user.taskWatchers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}

