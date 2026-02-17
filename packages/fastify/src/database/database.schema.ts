import { Type } from 'typebox';

import { Environments } from '../config';
import { SSLMode } from './database.interface';

const SSLEnum = Type.Enum(SSLMode, {
  default: SSLMode.Prefer,
  description: 'SSL mode: disable | prefer | require'
});

export const BASE_ENV_SCHEMA = Type.Object({
  DB_NAME: Type.String({ default: 'postgres' }),
  DB_SCHEMA: Type.String({
    default: 'public'
  })
});

export const DATABASE_LOCAL_ENV_SCHEMA = Type.Object({
  DB_USER: Type.String({ default: 'postgres' }),
  DB_PASSWORD: Type.Optional(Type.String({ default: 'postgres' })),
  DB_HOST: Type.String({ default: 'database' }),
  DB_PORT: Type.Number({ default: 5432 }),
  DB_SSL: Type.Optional(SSLEnum)
});

export const DATABASE_RW_ENV_SCHEMA = Type.Object({
  DB_RW_USER: Type.String(),
  DB_RW_PASSWORD: Type.Optional(Type.String()),
  DB_RW_HOST: Type.String(),
  DB_RW_PORT: Type.Number(),
  DB_RW_SSL: Type.Optional(SSLEnum)
});

export const DATABASE_RO_ENV_SCHEMA = Type.Object({
  DB_RO_USER: Type.String(),
  DB_RO_PASSWORD: Type.Optional(Type.String()),
  DB_RO_HOST: Type.String(),
  DB_RO_PORT: Type.Number(),
  DB_RO_SSL: Type.Optional(SSLEnum)
});

export const DATABASE_ADMIN_ENV_SCHEMA = Type.Object({
  DB_ADMIN_USER: Type.String(),
  DB_ADMIN_PASSWORD: Type.Optional(Type.String()),
  DB_ADMIN_HOST: Type.String(),
  DB_ADMIN_PORT: Type.Number(),
  DB_ADMIN_SSL: Type.Optional(SSLEnum)
});

/**
 * Include the complete database schema
 * - For local development
 * - Read/Write
 * - Read/Only
 * - Admin access
 */
export const getDatabaseEnvSchema = (environment: Environments) =>
  Type.Evaluate(
    Type.Intersect(
      [
        BASE_ENV_SCHEMA,
        environment === 'local'
          ? DATABASE_LOCAL_ENV_SCHEMA
          : Type.Evaluate(
              Type.Intersect([
                DATABASE_RW_ENV_SCHEMA,
                DATABASE_RO_ENV_SCHEMA,
                DATABASE_ADMIN_ENV_SCHEMA
              ])
            )
      ].filter(Boolean)
    )
  );
