/* eslint @typescript-eslint/no-explicit-any: 1 */
export interface IRedisCacheConfig {
  engine: 'redis';
  host: string;
  partition: string;
  port?: number;
  timeout?: number;
  replicats?: [{
    host: string;
    port?: number;
    enabled?: boolean;
  }];
}

export interface IServerConfiguration {
  port: number;
  routes: string[];
  plugins: string[];
  pluginsOptions: any;
  host?: string;
  cache?: IRedisCacheConfig;
  baseHref?: string;
}

export interface IDatabaseConfiguration {
  dialect?: 'sqlite' | 'postgres';
  models?: string[];
}

export interface ISqliteConfiguration extends IDatabaseConfiguration {
  dialect: 'sqlite';
  host: string;
  storage: string;
}

export interface IPostgresConfiguration extends IDatabaseConfiguration {
  dialect: 'postgres';
  host: string;
  port: number;
  dbname: string;
  username?: string;
  password?: string;
  timeout?: number;
  pool?: {
    max?: number;
    min?: number;
    acquire?: number;
    idle?: number;
  }
}

export interface IDBStringConfiguration extends IDatabaseConfiguration {
  connectionString: string;
}

export type IDataConfiguration = ISqliteConfiguration | IPostgresConfiguration | IDBStringConfiguration;

export interface IMailConfiguration {
  from: string;
  to?: string;
  host?: string;
  port?: number;
  aws?: boolean;
  region?: string;
}

export interface IConfigOptions {
  argv?: {
    parseValues?: boolean;
  },
  env?: {
    separator?: string;
    prefixKey?: string;
    removePrefixKey?: boolean;
    parseValues?: boolean;
  }
}