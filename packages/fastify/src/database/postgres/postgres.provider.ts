import { FastifyPluginAsync } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { FastifyInstance } from 'fastify/types/instance';
import { Pool } from 'pg';

import { isFactory } from '../../provider';
import { DatabaseOrm, DatabaseOrmKind } from '../orm';
import { DatabaseConfig, getLocalConfig, getPoolConfig } from './postgres';

export type Options = DatabaseConfig & {
  orm: DatabaseOrm<DatabaseOrmKind>;
};

export const postgresDatabasePlugin: FastifyPluginAsync<Options> =
  fastifyPlugin(
    async (instance: FastifyInstance, options: Options): Promise<void> => {
      const rwClient = getReadWritePool(options);

      // Test the main connection
      try {
        const client = await rwClient.connect();
        client.release();
      } catch (error) {
        console.error('Error connecting to database:', error);
        throw error;
      }

      const ormProvider = options.orm.provider;
      const orm = isFactory(ormProvider)
        ? ormProvider.useFactory(rwClient, getReadOnlyPool(options))
        : ormProvider.useValue;
      instance.decorate('db', orm);

      return;
    }
  );

function getReadWritePool(options: Options) {
  const config =
    options.ENVIRONMENT === 'local'
      ? getLocalConfig(options)
      : getPoolConfig(options, 'RW');
  if (!config) {
    throw new Error('Database config not found');
  }
  return new Pool(config);
}

function getReadOnlyPool(options: Options) {
  const readOnlyConfig = getPoolConfig(options, 'RO');
  return new Pool(readOnlyConfig);
}
