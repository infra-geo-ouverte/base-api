import * as Hapi from '@hapi/hapi';
import * as Boom from '@hapi/boom';
import { QueryOptions as SequelizeQueryOptions } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import * as camelcase from 'camelcase';

import { Config, IDatabaseConfiguration, IDBStringConfiguration, IPostgresConfiguration, ISqliteConfiguration } from '../configurations';
import { log } from '../utils/log';

export interface QueryOptions extends SequelizeQueryOptions {
  request?: Hapi.Request;
  requestId?: string;
}

export class IDatabase {
  public sequelize: Sequelize;

  query(sql: string, options?: QueryOptions) {
    return this.sequelize.query(sql, options);
  }

  initDatabase(server: Hapi.Server) {
    const dbConfigs = Config.getDatabaseConfig();

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
      const dbPG: IPostgresConf = dbConfigs as IPostgresConf;
      this.sequelize = new Sequelize(dbPG.database, dbPG.username, dbPG.password, {
        host: dbPG.host,
        port: dbPG.port,
        dialect: dbPG.dialect,
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
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      });
    } else {
      const dbSqlite: ISqliteConf = dbConfigs as ISqliteConf;
      this.sequelize = new Sequelize('database', 'username', 'password', {
        host: dbSqlite.host,
        dialect: dbSqlite.dialect,
        storage: dbSqlite.storage
      });
    }
    // Global error Handler
    (this.sequelize as any).query = function() {
      return Sequelize.prototype.query.apply(this, arguments).catch(err => {
        const request = arguments[1] ? arguments[1].request : server;
        request.log(['error', 'database'], `\u001b[1m${Boom.badRequest(err).message}`);
        throw Boom.badRequest('Bad Database Request');
      });
    };

        // Add models
    this.sequelize.addModels([`${Config.getBasePath()}'/**/*.model.*`], (filename, member) => {
      const className = camelcase(filename.substring(0, filename.indexOf('.model')), {
        pascalCase: true
      });
      return className === member;
    });

    // Create tables if not exist
    this.sequelize.sync();
  }
}

export const database = new IDatabase();
