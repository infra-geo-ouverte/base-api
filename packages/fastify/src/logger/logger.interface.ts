import { LevelWithSilentOrString } from 'pino';
import { Type } from 'typebox';

export interface ILoggerEnv {
  LOG_LEVEL: LevelWithSilentOrString;
  LOG_EXCLUDE_IPS?: string[];
  LOG_EXCLUDE_USERS?: string[];
  LOG_EXCLUDE_PATHS?: string[];
}

export const LOGGER_ENV_SCHEMA = Type.Object({
  LOG_LEVEL: Type.String({ default: 'info' }),
  LOG_EXCLUDE_IPS: Type.Optional(Type.String({ separator: ',' })),
  LOG_EXCLUDE_USERS: Type.Optional(Type.String({ separator: ',' })),
  LOG_EXCLUDE_PATHS: Type.Optional(Type.String({ separator: ',' }))
});
