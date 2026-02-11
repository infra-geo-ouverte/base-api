import { DrizzleConfig } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { withReplicas as withDrizzleReplicas } from 'drizzle-orm/pg-core';
import { Pool } from 'pg';

import { Environments } from '../../../config/config.interface';
import { DatabaseOrm, DatabaseOrmKind } from '../orm.interface';

type Options<TSchema extends Record<string, unknown> = Record<string, never>> =
  DrizzleConfig<TSchema> & {
    environment: Environments;
    withReplicas?: boolean;
  };

export function withDrizzlePg<
  TSchema extends Record<string, unknown> = Record<string, never>
>({
  withReplicas,
  environment,
  ...config
}: Options<TSchema>): DatabaseOrm<DatabaseOrmKind.Drizzle> {
  return {
    kind: DatabaseOrmKind.Drizzle,
    provider: {
      useFactory: (client: Pool, readOnlyClient?: Pool) => {
        const readWriteClient = drizzle<TSchema>({
          client,
          ...config
        });
        if (!withReplicas || environment === 'local') {
          return readWriteClient;
        }

        if (!readOnlyClient) {
          throw Error("Le 'readOnlyClient' doit être défini");
        }

        const readOnlyPool = drizzle({
          client: readOnlyClient,
          ...config
        });
        return withDrizzleReplicas(readWriteClient, [readOnlyPool]);
      }
    }
  };
}
