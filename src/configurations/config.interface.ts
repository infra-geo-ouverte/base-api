export interface IRedisCacheConfig {
  engine: 'redis';
  host: string;
  partition: string;
  port?: string;
  timeout?: number;
  replicats?: [{
    host: string;
    port?: string;
    enabled?: boolean;
  }];
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
  database: string;
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
  host: string;
  port: number;
  from: string;
  to?: string;
}
