import { IncomingHttpHeaders } from 'node:http2';

import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyRequest,
  preHandlerHookHandler
} from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import Value from 'typebox/value';

import { IConsumer } from '../authentification.interface';
import {
  HEADERS_CONSUMER_SCHEMA,
  HEADERS_CONSUMER_SCHEMA_REF,
  HeaderAnoymousConsumer,
  HeaderConsumer
} from './header-authentification.interface';

/**
 * Factory function to create a Fastify preHandler hook for authorization.
 * @param requiredGroups - A list of consumer groups that are authorized.
 */
export const headerAuthentification: FastifyPluginAsync = fastifyPlugin(
  async (app: FastifyInstance) => {
    app.addSchema(HEADERS_CONSUMER_SCHEMA);

    app.addHook('onRoute', (options) => {
      if (!options.schema) {
        return;
      }

      options.schema = {
        ...options.schema,
        headers: HEADERS_CONSUMER_SCHEMA_REF
      };
    });

    app.addHook('preHandler', headerAuthentificationHook());
  }
);

function headerAuthentificationHook(): preHandlerHookHandler {
  return async (request) => setConsumer(request);
}

function setConsumer(request: FastifyRequest): void {
  const consumer = getConsumer(request.headers);
  request.consumer = consumer;
  return;
}

function getConsumer(incomingHeaders: IncomingHttpHeaders): IConsumer {
  const headers = formatHeaders(incomingHeaders);
  const isAnonymous =
    String(headers[HeaderAnoymousConsumer]).toLowerCase() === 'true';

  // Use a type assertion for safety since 'groups' should be an array after formatHeaders
  const groupsRaw = headers['x-consumer-groups' as HeaderConsumer] as string[];

  return {
    id: headers['x-consumer-id' as HeaderConsumer] as string,
    customId: Number(headers['x-consumer-custom-id' as HeaderConsumer]),
    username: headers['x-consumer-username' as HeaderConsumer] as string,
    groups: groupsRaw ?? [],
    isAnonymous: isAnonymous
  };
}

function formatHeaders(headers: IncomingHttpHeaders) {
  const xConsumerGroupsKey = 'x-consumer-groups' satisfies HeaderConsumer;
  if (headers[xConsumerGroupsKey]) {
    headers[xConsumerGroupsKey] = Value.Decode(
      HEADERS_CONSUMER_SCHEMA['properties'][xConsumerGroupsKey],
      headers[xConsumerGroupsKey]
    ) as string[];
  }
  return headers;
}
