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

export type PgClientConfig = ClientConfig | PgPoolConfig;

export type PgPoolConfig = PoolConfig &
  Required<
    Pick<ClientConfig, 'host' | 'database' | 'user' | 'port' | 'password'>
  >;

export type DatabaseConfig = IConfig &
  IDatabaseEnv & {
    /** A password signer by example to be compatible with the AWS RDS @aws-sdk/rds-signer */
    signer?(config: PgPoolConfig): () => string | Promise<string>;
  };

export function getAdminConfig(env: DatabaseConfig): PgClientConfig {
  const environment = env.ENVIRONMENT;
  return !environment || environment === 'local'
    ? getLocalConfig(env)
    : getClientConfig<'ADMIN'>(env, 'ADMIN');
}

export const getLocalConfig = (env: DatabaseConfig): PgClientConfig => {
  return getClientConfig(env);
};

export function getPoolConfig(
  options: DatabaseConfig,
  type?: ConfigType
): PgPoolConfig {
  const config = getClientConfig(options, type);

  const baseConfig: PgPoolConfig = {
    ...config,
    idleTimeoutMillis: 900000, // 15 minutes de idle, le proxy de AWS à un jeu 30 minutes
    maxLifetimeSeconds: 43200 // 12 heures, le proxy de AWS à un jeu de 24 heures
  } as PgPoolConfig;

  if (options.signer) {
    baseConfig.password = options.signer!(baseConfig);
  }

  return baseConfig;
}

function getClientConfig<P extends ConfigType>(
  options: PrefixedConfig<P> | DatabaseConfig,
  type?: ConfigType
): PgClientConfig {
  const _getEnvValue = <K extends keyof BaseConfig>(key: K): BaseConfig[K] => {
    return getEnvValue(key, options, type);
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
    database: options.DB_NAME,
    ssl
  };
}

function getEnvValue<P extends ConfigType, K extends keyof BaseConfig>(
  key: K,
  env: PrefixedConfig<P> | DatabaseConfig,
  type?: ConfigType
): BaseConfig[K] {
  if (type) {
    return (env as PrefixedConfig<P>)[
      `DB_${type}_${key}` as keyof PrefixedConfig<P>
    ] as never as BaseConfig[K];
  } else {
    return (env as DatabaseConfig)[
      `DB_${key}` as keyof IDatabaseLocalEnv
    ] as never as BaseConfig[K];
  }
}
