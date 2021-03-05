import * as Hapi from '@hapi/hapi';

import { IPlugin, IPluginOptions } from '../plugin.interface';
import { RouteOptions } from './route.options';

export default (): IPlugin => {
  return {
    name: 'Route',
    version: '1.0.0',
    register: async (server: Hapi.Server, options: IPluginOptions = {}) => {
      const opts: RouteOptions = options.route || {};

      await server.register({
        plugin: require('blipp'),
        options: opts
      });
    }
  };
};
