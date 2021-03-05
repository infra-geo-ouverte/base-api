import * as Hapi from '@hapi/hapi';

import { Config } from '../../configurations';
import { IPlugin, IPluginOptions } from '../plugin.interface';

import { HealthOptions } from './health.options';

export default (): IPlugin => {
  return {
    name: 'Health',
    version: '1.0.0',
    register: async (server: Hapi.Server, options: IPluginOptions = {}) => {
      const opts: HealthOptions = Object.assign({
        path: Config.getServerConfig().baseHref || '' + '/health',
        tags: ['health'],
        responses: {
          healthy: {
            message: 'I\'m healthy!'
          },
          unhealthy: {
            statusCode: 500
          }
        },
        healthCheck: async (_server) => {
          return await true;
        }
      }, options.health);

      await server.register({
        plugin: require('hapi-alive'),
        options: opts
      });
    }
  };
};
