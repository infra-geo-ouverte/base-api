import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

import { IConfig } from '../config';
import {
  BaseClientConfig,
  DatabaseEnv,
  getClientConfig,
  getLocalConfig
} from './database.config';
import { DatabaseOrm, DatabaseOrmKind } from './database.interface';

type Options = DatabaseEnv &
  IConfig & {
    orm: (config: BaseClientConfig) => DatabaseOrm<DatabaseOrmKind>;
  };

export const databasePlugin: FastifyPluginAsync<Options> = fastifyPlugin(
  async (instance: FastifyInstance, options: Options): Promise<void> => {
    const config =
      options.ENVIRONMENT === 'local'
        ? getLocalConfig(options)
        : getClientConfig(options, 'RW');
    if (!config) {
      throw new Error('Database config not found');
    }

    instance.decorate('orm', options.orm(config).provider);

    return;
  }
);
