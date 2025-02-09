import { Task } from "./model";


export interface ITaskRepository {
  findById(id: number): Promise<Task>;
  findByTeamId(teamId: number): Promise<Task[]>;
  findByCreatorId(creatorId: number): Promise<Task[]>;
  create(task: Task): Promise<Task>;
  update(task: Task): Promise<Task>;
  delete(id: number): Promise<void>;

  findByParentId(parentId: number): Promise<Task[]>;
}

export interface ITaskService {
  getTaskById(id: number): Promise<Task>;
  getTasksByTeam(teamId: number): Promise<Task[]>;
  getTasksByCreator(creatorId: number): Promise<Task[]>;
  getSubTasks(parentId: number): Promise<Task[]>;

  createTask(task: Task): Promise<Task>;
  updateTask(task: Task): Promise<Task>;
  deleteTask(id: number): Promise<void>;

  completeTask(id: number): Promise<Task>;
}
