import camelcase from 'camelcase';
import { Pool } from 'pg';
import { ModelCtor, Sequelize, SequelizeOptions } from 'sequelize-typescript';

import { DatabaseOrm, DatabaseOrmKind } from '../orm.interface';

export function withSequelize({
  models
}: {
  models?: SequelizeOptions['models'];
}): DatabaseOrm<DatabaseOrmKind.Sequelize> {
  return {
    kind: DatabaseOrmKind.Sequelize,
    provider: {
      useFactory: (clientRW: Pool) => {
        const options = clientRW.options;
        clientRW.end();

        if (options.password instanceof Function) {
          throw new Error("Sequelize doesn't support Function password");
        }

        if (!options.database || !options.user) {
          throw new Error(
            'database and user options are required for Sequelize'
          );
        }

        const sequelize = new Sequelize(
          options.database,
          options.user,
          options.password,
          {
            host: options.host,
            port: options.port,
            dialect: 'postgres',
            dialectOptions: {
              ssl: options.ssl,
              statement_timeout: options.statement_timeout
            },
            pool: {
              max: options?.max ?? 5,
              min: options?.min ?? 0,
              idle: options?.idleTimeoutMillis ?? 10000
            }
          }
        );

        // Add models
        if (models) {
          if (isStringArray(models)) {
            sequelize.addModels(models, (filename, member) => {
              const className = camelcase(
                filename.substring(0, filename.indexOf('.model')),
                {
                  pascalCase: true
                }
              );
              return className === member;
            });
          } else {
            sequelize.addModels(models);
          }
        }

        return sequelize;
      }
    }
  };
}

function isStringArray(arr: string[] | ModelCtor[]): arr is string[] {
  if (arr.length === 0) {
    return true;
  }

  return typeof arr[0] === 'string';
}
