import { ClientConfig, PoolConfig } from 'pg';

import { IConfig } from '../../config';
import {
  BaseConfig,
  ConfigType,
  IDatabaseEnv,
  IDatabaseLocalEnv,
  PrefixedConfig,
  SSLMode
} from '../database.interface';

export type PgClientConfig =
  | ClientConfig
  | (PoolConfig &
      Required<Pick<ClientConfig, 'host' | 'database' | 'user' | 'port'>> & {
        password: string;
      });

export type DatabaseEnv = IConfig & IDatabaseEnv;

export function getAdminConfig(env: DatabaseEnv): PgClientConfig {
  const environment = env.ENVIRONMENT;
  return !environment || environment === 'local'
    ? getLocalConfig(env)
    : getClientConfig<'ADMIN'>(env, 'ADMIN');
}

export const getLocalConfig = (env: DatabaseEnv): PgClientConfig => {
  return getClientConfig(env);
};

export function getPoolConfig<P extends ConfigType>(
  env: PrefixedConfig<P> | DatabaseEnv,
  type?: ConfigType
): PoolConfig {
  const config = getClientConfig(env, type);

  return {
    ...config,
    idleTimeoutMillis: 900000, // 15 minutes de idle, le proxy de AWS à un jeu 30 minutes
    maxLifetimeSeconds: 43200, // 12 heures, le proxy de AWS à un jeu de 24 heures
    password: config.password
  };
}

function getClientConfig<P extends ConfigType>(
  env: PrefixedConfig<P> | DatabaseEnv,
  type?: ConfigType
): PgClientConfig {
  const _getEnvValue = <K extends keyof BaseConfig>(key: K): BaseConfig[K] => {
    return getEnvValue(key, env, type);
  };

  const sslMode = _getEnvValue('SSL');
  let ssl;
  if (sslMode === SSLMode.Require) {
    ssl = true;
  } else if (sslMode === SSLMode.Disable) {
    ssl = false;
  } else {
    ssl = { rejectUnauthorized: false };
  }

  return {
    connectionTimeoutMillis: 10000,
    host: _getEnvValue('HOST'),
    port: _getEnvValue('PORT'),
    user: _getEnvValue('USER'),
    password: _getEnvValue('PASSWORD'),
    database: env.DB_NAME,
    ssl
  };
}

function getEnvValue<P extends ConfigType, K extends keyof BaseConfig>(
  key: K,
  env: PrefixedConfig<P> | DatabaseEnv,
  type?: ConfigType
): BaseConfig[K] {
  if (type) {
    return (env as PrefixedConfig<P>)[
      `DB_${type}_${key}` as keyof PrefixedConfig<P>
    ] as never as BaseConfig[K];
  } else {
    return (env as DatabaseEnv)[
      `DB_${key}` as keyof IDatabaseLocalEnv
    ] as never as BaseConfig[K];
  }
}
