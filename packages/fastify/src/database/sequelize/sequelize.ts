import camelCase from 'camelcase';
import { ModelCtor, Sequelize } from 'sequelize-typescript';

import { ISequelizeOptions } from './sequelize.interface';

export class IgoSequelize {
  public sequelize: Sequelize;

  constructor(
    dialect: 'postgres' | 'sqlite',
    { database, user, password, ...options }: ISequelizeOptions
  ) {
    if (dialect === 'postgres') {
      this.sequelize = new Sequelize(database, user, password, {
        host: options.host,
        port: options.port,
        dialect: dialect,
        // schema: options.schema,
        // searchPath: dbPG.searchPath || 'DEFAULT',
        dialectOptions: options.dialectOptions,
        pool: {
          max: options.pool?.max ?? 5,
          min: options.pool?.min ?? 0,
          idle: options.pool?.idle ?? 10000
        }
      });
    } else {
      this.sequelize = new Sequelize('database', 'username', 'password', {
        host: options.host,
        dialect: dialect,
        storage: './igo-test.db'
      });
    }

    // Add models
    const models = options.models;
    if (models) {
      if (isStringArray(models)) {
        this.sequelize.addModels(models, (filename, member) => {
          const className = camelCase(
            filename.substring(0, filename.indexOf('.model')),
            {
              pascalCase: true
            }
          );
          return className === member;
        });
      } else {
        this.sequelize.addModels(models);
      }
    }

    // Create tables if not exist
    // await this.sequelize.sync();
  }
}

function isStringArray(arr: string[] | ModelCtor[]): arr is string[] {
  if (arr.length === 0) {
    return true;
  }

  return typeof arr[0] === 'string';
}
