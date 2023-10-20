import { IPluginOptions } from '../plugins';

export interface IRedisCacheConfig {
  engine: 'redis';
  host: string;
  partition: string;
  port?: number;
  db?: string;
  tls?: boolean;
  timeout?: number;
  replicats?: [{
    host: string;
    port?: number;
    enabled?: boolean;
  }];
  sentinels?: [{
    host: string;
    port: number;
  }];
  sentinelName?: string;
}

export interface IServerConfiguration {
  port: number;
  routes: string[];
  routesOptions?: IRouteOptions;
  plugins: string[];
  pluginsOptions: IPluginOptions;
  host?: string;
  cache?: IRedisCacheConfig;
  baseHref?: string;
}

export interface IRouteOptions {
  clientCache?: {
    expiresIn?: number;
  }
  security?: {
    hsts?: boolean;
    xframe?: boolean | 'deny' | 'sameorigin';
    xss?: false | 'enabled' | 'disabled';
  }
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
  ssl?: boolean;
  pool?: {
    max?: number;
    min?: number;
    acquire?: number;
    idle?: number;
  }
}

export interface IDatabaseProxyConfiguration {
  host: string;
  port: number;
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