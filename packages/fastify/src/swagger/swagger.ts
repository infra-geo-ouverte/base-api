import fastifySwagger, { FastifyDynamicSwaggerOptions } from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

import { IConfig } from '../config';

type Options = Exclude<FastifyDynamicSwaggerOptions['openapi'], undefined> &
  IConfig;

export const swaggerPlugin: FastifyPluginAsync<Options> = fastifyPlugin(
  async (instance: FastifyInstance, options: Options): Promise<void> => {
    await instance.register(fastifySwagger, {
      openapi: {
        openapi: '3.0.0',
        servers: [
          {
            url: `http://127.0.0.1:${options.PORT}`,
            description: options.ENVIRONMENT
          }
        ],
        ...(options ?? {})
      }
    });

    await instance.register(fastifySwaggerUi, {
      routePrefix: '/docs',
      uiConfig: {
        docExpansion: 'full',
        deepLinking: false
      }
    });
  }
);
