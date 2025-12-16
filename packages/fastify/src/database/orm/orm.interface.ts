/* eslint-disable @typescript-eslint/no-explicit-any */
import { FactoryProvider, ValueProvider } from '../../provider';
import { DatabaseConfig } from '../postgres';

export interface DatabaseOrm<KindT extends DatabaseOrmKind> {
  kind: KindT;
  provider:
    | ValueProvider
    | FactoryProvider<
        (
          clientRW: any,
          clientRO?: any,
          signer?: DatabaseConfig['signer']
        ) => any // rw for read/write and ro for readonly
      >;
}

export enum DatabaseOrmKind {
  Sequelize = 0,
  Drizzle = 1
}
