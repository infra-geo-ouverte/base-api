import { FactoryProvider, ValueProvider } from '../../provider';

export interface DatabaseOrm<KindT extends DatabaseOrmKind> {
  kind: KindT;
  provider:
    | ValueProvider
    | FactoryProvider<
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (clientRW: any, clientRO?: any) => any // rw for read/write and ro for readonly
      >;
}

export enum DatabaseOrmKind {
  Sequelize = 0,
  Drizzle = 1
}
