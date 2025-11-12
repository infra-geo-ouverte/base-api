import { SequelizeOptions } from 'sequelize-typescript';

export interface ISequelizeOptions extends SequelizeOptions {
  database: string;
  user: string;
  password: string | undefined;
}
