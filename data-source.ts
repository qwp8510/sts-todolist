import { DataSource } from 'typeorm';
import { DB_HOST, DB_NAME, DB_PORT, DB_PWD, DB_USERNAME } from './src/config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PWD,
  database: DB_NAME,
  entities: ['src/**/entity.{ts,js}'],
  migrations: ['migration/*.{ts,js}'],
  synchronize: false,
  subscribers: [],
});
