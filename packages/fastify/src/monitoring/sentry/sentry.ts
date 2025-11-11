import * as Sentry from '@sentry/node';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

import { ISentryEnv } from './sentry.interface';

export const sentryPlugin: FastifyPluginAsync<ISentryEnv> = fastifyPlugin(
  async (instance: FastifyInstance, options: ISentryEnv): Promise<void> => {
    const { SENTRY_DSN, ENVIRONMENT } = options;
    if (!SENTRY_DSN && ENVIRONMENT !== 'local') {
      throw new Error('SENTRY_DSN config not found');
    }

    Sentry.setupFastifyErrorHandler(instance);
  }
);
