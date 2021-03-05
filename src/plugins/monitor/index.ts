import * as Hapi from '@hapi/hapi';

import { UserValidator } from '../../user';
import { IPlugin, IPluginOptions } from '../plugin.interface';

import { MonitorOptions } from './monitor.options';

export default (): IPlugin => {
  return {
    name: 'Monitor',
    version: '1.0.0',
    register: async (server: Hapi.Server, options: IPluginOptions = {}) => {
      const opts: MonitorOptions = Object.assign({
        title: 'Monitor',
        path: (options?.global?.baseHref || '') + '/status',
        routeConfig: {
          validate: {
            headers: UserValidator.adminValidator
          }
        }
      }, options.monitor);

      await server.register({
        plugin: require('hapijs-status-monitor'),
        options: opts
      });
    }
  };
};
