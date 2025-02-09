import { User } from "./model";

export interface IUserRepository {
  findById(id: number): Promise<User>;
  findByUsername(username: string): Promise<User>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: number): Promise<void>;
}

export interface IUserService {
  getUserById(id: number): Promise<User>;
  getUserByUsername(username: string): Promise<User>;
  createUser(user: User): Promise<User>;
  updateUser(user: User): Promise<User>;
  deleteUser(id: number): Promise<void>;
}
