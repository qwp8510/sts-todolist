import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './task/module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_HOST, DB_NAME, DB_PORT, DB_PWD, DB_USERNAME } from './config';
import { Task } from './task/entity';

process.env.TZ = 'UTC';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: DB_HOST,
      port: DB_PORT,
      username: DB_USERNAME,
      password: DB_PWD,
      database: DB_NAME,
      entities: [Task],
      // entities: ['**/entity{.ts,.js}'],
      synchronize: false,
    }),
  ],
})
export class DbModule {}

@Module({
  imports: [
    TasksModule,
    DbModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
