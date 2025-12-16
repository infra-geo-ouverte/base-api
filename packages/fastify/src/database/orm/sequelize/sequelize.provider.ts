import camelcase from 'camelcase';
import { Pool } from 'pg';
import { ModelCtor, Sequelize, SequelizeOptions } from 'sequelize-typescript';

import { DatabaseOrm, DatabaseOrmKind } from '../orm.interface';

export function withSequelize({
  models,
  ...config
}: Partial<SequelizeOptions>): DatabaseOrm<DatabaseOrmKind.Sequelize> {
  return {
    kind: DatabaseOrmKind.Sequelize,
    provider: {
      useFactory: (clientRW: Pool) => {
        const options = clientRW.options;
        clientRW.end();

        if (!options.database || !options.user) {
          throw new Error(
            'database and user options are required for Sequelize'
          );
        }

        const password = options.password;

        const sequelize = new Sequelize(
          options.database,
          options.user,
          password instanceof Function ? undefined : password,
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
            },
            ...(config ?? {})
          }
        );

        if (password instanceof Function) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (sequelize as any).beforeConnect(async (config: any) => {
            const passwordString = await password();
            config.password = passwordString;
          });
        }

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
