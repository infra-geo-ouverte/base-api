import { Type } from 'typebox';

import { IConfigBase } from '../../config';

export interface ISentryEnv extends IConfigBase {
  SENTRY_DSN?: string;
}

export const SENTRY_ENV_SCHEMA = Type.Object({
  SENTRY_DSN: Type.Optional(Type.String())
});
