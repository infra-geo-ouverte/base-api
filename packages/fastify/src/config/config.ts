import fastifyEnv from '@fastify/env';
import { FastifyPluginAsync } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { FastifyInstance } from 'fastify/types/instance';
import { TObject, Type } from 'typebox';

import { CONFIG_SCHEMA } from './config.interface';

interface ConfigOptions {
  appEnvSchema?: TObject;
  defaultValue?: Record<string, unknown>;
}

type ConfigPlugin = FastifyPluginAsync<ConfigOptions>;

const configPluginFn: ConfigPlugin = async (
  instance: FastifyInstance,
  options: ConfigOptions
): Promise<void> => {
  let schema: TObject = CONFIG_SCHEMA;

  if (options.appEnvSchema) {
    schema = Type.Evaluate(Type.Intersect([schema, options.appEnvSchema]));
  }

  instance.register(fastifyEnv, {
    confKey: 'env',
    schema,
    expandEnv: true,
    dotenv: {
      quiet: true
    },
    data: options.defaultValue
  });
};

export const configPlugin: ConfigPlugin = fastifyPlugin(configPluginFn);
