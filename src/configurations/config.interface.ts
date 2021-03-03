export interface IRedisCacheConfig {
  engine: 'redis';
  host: string;
  partition: string;
}

export interface IServerConfiguration {
  port: number;
  routes: string[];
  plugins: string[];
  pluginsOptions: any;
  cache?: IRedisCacheConfig;
  baseHref?: string;
}

export interface IDatabaseConfiguration {
  dialect?: 'sqlite' | 'postgres';
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
  database: string;
  username?: string;
  password?: string;
}

export interface IDBStringConfiguration extends IDatabaseConfiguration {
  connectionString: string;
}

export type IDataConfiguration = ISqliteConfiguration | IPostgresConfiguration | IDBStringConfiguration;

export interface IMailConfiguration {
  host: string;
  port: number;
  from: string;
  to?: string;
}
