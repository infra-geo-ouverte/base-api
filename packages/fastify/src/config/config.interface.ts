import { Type } from 'typebox';

import { UnionLiteral } from '../schema/schema';

const Environments = ['local', 'development', 'staging', 'production'] as const;
export type Environments = (typeof Environments)[number];

export interface IConfig extends IConfigBase {
  DOMAIN_CLIENT: string;
  PORT: number;
}

export interface IConfigBase {
  ENVIRONMENT: Environments;
  RELEASE: string;
}

export const CONFIG_SCHEMA = Type.Object({
  ENVIRONMENT: UnionLiteral(Environments),
  RELEASE: Type.String({ default: 'local' }), // SEMVER except for the local environment
  DOMAIN_CLIENT: Type.Optional(Type.String()),
  PORT: Type.Number({ default: 5000 }) // The same port as the forwarded port in the devcontainer.json
});
