export enum SSLMode {
  Disable = 'disable',
  Prefer = 'prefer',
  Require = 'require'
}

export interface BaseConfig {
  USER: string;
  PASSWORD: string;
  HOST: string;
  PORT: number;
  SSL: SSLMode;
}

interface IDatabaseBaseEnv {
  DB_NAME: string;
  DB_SCHEMA?: string;
}

/**
 * The config type allow to give specific value base on database permission
 * LOCAL: only for local development
 * RW: read and write
 * RO: read only
 * ADMIN: admin
 */
export type ConfigType = 'LOCAL' | 'RW' | 'RO' | 'ADMIN';

export type IDatabaseLocalEnv = {
  [K in keyof BaseConfig as `DB_${K & string}`]: BaseConfig[K];
} & IDatabaseBaseEnv;

/**
 * Will generate Database interface base on permission like:
 * interface {
 *  DB_RW_USER: string
 *  ...
 * }
 */
export type PrefixedConfig<Prefix extends ConfigType> = {
  [K in keyof BaseConfig as `DB_${Prefix}_${K & string}`]: BaseConfig[K];
} & IDatabaseBaseEnv;

export type IDatabaseRwEnv = PrefixedConfig<'RW'>;
export type IDatabaseRoEnv = PrefixedConfig<'RO'>;
export type IDatabaseAdminEnv = PrefixedConfig<'ADMIN'>;

export type IDatabaseEnv = IDatabaseLocalEnv &
  IDatabaseRwEnv &
  IDatabaseRoEnv &
  IDatabaseAdminEnv;
