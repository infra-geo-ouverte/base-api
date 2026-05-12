import { AnyRelations, EmptyRelations } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import {
  DrizzlePgConfig,
  withReplicas as withDrizzleReplicas
} from 'drizzle-orm/pg-core';
import { Pool } from 'pg';

import { Environments } from '../../../config/config.interface';
import { DatabaseOrm, DatabaseOrmKind } from '../orm.interface';

type Options<TRelations extends AnyRelations = EmptyRelations> =
  DrizzlePgConfig<TRelations> & {
    environment: Environments;
    withReplicas?: boolean;
  };

export function withDrizzlePg<
  TRelations extends AnyRelations = EmptyRelations
>({
  withReplicas,
  environment,
  ...config
}: Options<TRelations>): DatabaseOrm<DatabaseOrmKind.Drizzle> {
  return {
    kind: DatabaseOrmKind.Drizzle,
    provider: {
      useFactory: (client: Pool, readOnlyClient?: Pool) => {
        const readWriteClient = drizzle<TRelations>({
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
