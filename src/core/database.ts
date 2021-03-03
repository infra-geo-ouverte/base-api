import * as Hapi from 'hapi';
import * as Boom from 'boom';
import { Sequelize, QueryOptions as SequelizeQueryOptions } from 'sequelize';
import { Config, IDatabaseConfiguration, IDBStringConfiguration, IPostgresConfiguration, ISqliteConfiguration } from '../configurations';

export interface QueryOptions extends SequelizeQueryOptions {
  request?: Hapi.Request;
}

export class IDatabase {
  private sequelize: Sequelize;

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

    if (dbString.connectionString) {
      this.sequelize = new Sequelize(dbString.connectionString);
    } else if (dbConf.dialect === 'postgres') {
      const dbPG: IPostgresConf = dbConfigs as IPostgresConf;
      this.sequelize = new Sequelize(dbPG.database, dbPG.username, dbPG.password, {
        host: dbPG.host,
        port: dbPG.port,
        dialect: dbPG.dialect,
        logging: (log: string, options) => {
          const request = (options as QueryOptions).request;
          log = log.replace(/\s\s+/g, ' ');
          if (request) {
            request.log(['info', 'database'], log);
          } else {
            server.log(['info', 'database'], log);
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
  }
}

export const database = new IDatabase();
