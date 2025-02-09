import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

const envPath = "./env";

dotenvExpand.expand(dotenv.config({ path: envPath }));

export const DB_HOST = process.env.DB_HOST || '0.0.0.0';
export const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 54322;
export const DB_USERNAME = process.env.DB_USERNAME || 'postgres';
export const DB_PWD = process.env.DB_PWD || 'abc123';
export const DB_NAME = process.env.DB_NAME || 'postgres';

export const SECRET_KEY = process.env.SECRET_KEY || 'secret123456';
