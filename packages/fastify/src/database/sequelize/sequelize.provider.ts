import { BaseClientConfig } from '../database.config';
import { DatabaseOrm, DatabaseOrmKind } from '../database.interface';
import { IgoSequelize } from './sequelize';

export function withSequelize(
  config: BaseClientConfig
): DatabaseOrm<DatabaseOrmKind.Sequelize> {
  const sequelize = new IgoSequelize('postgres', {
    database: config.database,
    user: config.user,
    password: config.password,
    host: config.host,
    port: config.port,
    schema: config.schema,
    // searchPath: dbPG.searchPath || 'DEFAULT',
    dialectOptions: {
      ssl: config.ssl,
      statement_timeout: config.statement_timeout
      // prependSearchPath: dbPG.searchPath ? true : undefined
    },
    pool: {
      max: config?.max ?? 5,
      min: config?.min ?? 0,
      idle: config?.idleTimeoutMillis ?? 10000
    }
  });

  return {
    kind: DatabaseOrmKind.Sequelize,
    provider: sequelize
  };
}
