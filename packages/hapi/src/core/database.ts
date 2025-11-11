/* eslint-disable @typescript-eslint/no-explicit-any */
import Boom from '@hapi/boom';
import Hapi from '@hapi/hapi';
import camelCase from 'camelcase';
import { QueryOptions as SequelizeQueryOptions } from 'sequelize';
import { Sequelize, SequelizeOptions } from 'sequelize-typescript';

import {
  Config,
  IDBStringConfiguration,
  IDatabaseConfiguration,
  IPostgresConfiguration,
  ISqliteConfiguration
} from '../configurations';
import { log } from '../utils';

export interface QueryOptions extends SequelizeQueryOptions {
  request?: Hapi.Request;
  requestId?: string;
}

export class IDatabase {
  public sequelize: Sequelize | undefined;

  query(sql: string, options?: QueryOptions) {
    return this.sequelize?.query(sql, options);
  }

  async initDatabase(server: Hapi.Server) {
    const dbConfigs = Config.getDatabaseConfig();
    const dbProxyConfig = Config.getDatabaseProxyConfig();

    type IDBConf = IDatabaseConfiguration;
    type IDBStringConf = IDBStringConfiguration;
    type IPostgresConf = IPostgresConfiguration;
    type ISqliteConf = ISqliteConfiguration;

    const dbString: IDBStringConf = dbConfigs as IDBStringConf;
    const dbConf: IDBConf = dbConfigs as IDBConf;

    if (!dbConfigs) {
      return;
    } else if (dbString.connectionString) {
      this.sequelize = new Sequelize(dbString.connectionString);
    } else if (dbConf.dialect === 'postgres') {
      const dbPG: IPostgresConf = dbConfigs as any;
      this.sequelize = new Sequelize(
        dbPG.dbname,
        dbPG.username!,
        dbPG.password,
        {
          host: dbProxyConfig?.host || dbPG.host,
          port: dbProxyConfig?.port || dbPG.port,
          dialect: dbPG.dialect,
          schema: dbPG.schema,
          searchPath: dbPG.searchPath || 'DEFAULT',
          logging: (data: string, options) => {
            const request = (options as QueryOptions).request;
            const requestId = (options as QueryOptions).requestId;

            data = data.replace(/\s\s+/g, ' ');
            const tags = ['info', 'database'];

            if (request) {
              request.log(tags, data);
            } else if (requestId) {
              log(tags, data, requestId);
            } else {
              server.log(tags, data);
            }
          },
          dialectOptions: {
            ssl: dbPG.ssl || dbProxyConfig ? true : false,
            statement_timeout: dbProxyConfig ? undefined : dbPG.timeout,
            prependSearchPath: dbPG.searchPath ? true : undefined
          },
          pool: {
            max: dbPG.pool?.max || 5,
            min: dbPG.pool?.min || 0,
            acquire: dbPG.pool?.acquire || 30000,
            idle: dbPG.pool?.idle || 10000
          }
        } as SequelizeOptions
      );
    } else {
      const dbSqlite: ISqliteConf = dbConfigs as ISqliteConf;
      this.sequelize = new Sequelize('database', 'username', 'password', {
        host: dbSqlite.host,
        dialect: dbSqlite.dialect,
        storage: dbSqlite.storage
      });
    }
    // Global error Handler
    (this.sequelize as any).query = function (...args: any[]) {
      return Sequelize.prototype.query.apply(this, args as any).catch((err) => {
        const request = args[1]?.request || server;
        request.log(['error', 'database'], `\u001b[1m${err}`);
        throw Boom.badRequest('Bad Database Request', err);
      });
    };

    // Add models
    if (dbConfigs.models) {
      for (const modelName of dbConfigs.models) {
        this.sequelize.addModels(
          [`${Config.getBasePath()}/${modelName}/*.model.*`],
          (filename, member) => {
            const className = camelCase(
              filename.substring(0, filename.indexOf('.model')),
              {
                pascalCase: true
              }
            );
            return className === member;
          }
        );
      }
    } else {
      this.sequelize.addModels(
        [`${Config.getBasePath()}/**/*.model.*`],
        (filename, member) => {
          const className = camelCase(
            filename.substring(0, filename.indexOf('.model')),
            {
              pascalCase: true
            }
          );
          return className === member;
        }
      );
    }

    // Create tables if not exist
    await this.sequelize.sync();
  }
}

export const database = new IDatabase();
