import * as Hapi from '@hapi/hapi';
import * as Boom from '@hapi/boom';
import * as Joi from 'joi';

import { IPlugin, IPluginOptions } from '../plugin.interface';
import { HealthOptions } from './health.options';

export default (): IPlugin => {
  return {
    name: 'Health',
    version: '1.0.0',
    register: async (server: Hapi.Server, options: IPluginOptions = {}) => {
      const optsHealth: HealthOptions = options.health || {};

      const opts: any = {
        path: optsHealth.path || (options?.global?.baseHref || '') + '/health',
        tags: ['health'],
        responses: {
          healthy: {
            message: optsHealth.messageHealthy || 'I\'m healthy!'
          },
          unhealthy: {
            statusCode: 500
          }
        },
        healthCheck: async (_server) => {
          return await true;
        }
      };

      server.route({
          method: 'GET',
          path: opts.path,
          options: {
              tags: opts.tags,
              description: 'Check if the server is healthy',
              handler: async function (request, h) {

                  try {
                      await opts.healthCheck(server);
                      return opts.responses.healthy.message;
                  }
                  catch (err) {
                      return Boom.boomify(err, { statusCode: opts.responses.unhealthy.statusCode });
                  }
              },
              response: {
                  schema: Joi.string().required(),
                  status: {
                      500: Joi.object({
                          statusCode: Joi.number().required().description('Standard http status code'),
                          error: Joi.string().required().description('Error title'),
                          message: Joi.string().description('Error description')
                      }).required().options({
                          allowUnknown: true,
                          stripUnknown: false
                      })
                  }
              }
            }
        });
      }
    }
  };
