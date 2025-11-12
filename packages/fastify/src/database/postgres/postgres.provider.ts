import { FastifyPluginAsync } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { FastifyInstance } from 'fastify/types/instance';
import { Pool } from 'pg';

import { IConfig } from '../../config/config.interface';
import { isFactory } from '../../provider';
import { IDatabaseEnv } from '../database.interface';
import { DatabaseOrm, DatabaseOrmKind } from '../orm/orm.interface';
import { getLocalConfig, getPoolConfig } from './postgres';

type Options = IDatabaseEnv &
  IConfig & {
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

      // the readOnly is base on replicas usage => should the database plugin should know about it?
      const ormProvider = options.orm.provider;
      const orm = isFactory(ormProvider)
        ? ormProvider.useFactory(rwClient, getReadOnlyPool(options))
        : ormProvider.useValue;
      instance.decorate('db', orm);

      return;
    }
  );

function getReadWritePool(env: Options) {
  const config =
    env.ENVIRONMENT === 'local'
      ? getLocalConfig(env)
      : getPoolConfig(env, 'RW');
  if (!config) {
    throw new Error('Database config not found');
  }
  return new Pool(config);
}

function getReadOnlyPool(env: Options) {
  const readOnlyConfig = getPoolConfig(env, 'RO');
  return new Pool(readOnlyConfig);
}
