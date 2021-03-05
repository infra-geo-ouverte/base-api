import * as Hapi from '@hapi/hapi';
import * as apm from 'elastic-apm-node';

import { IPlugin, IPluginOptions } from '../plugin.interface';
import { ApmOptions } from './apm.options';

export default (): IPlugin => {
  return {
    name: 'apm',
    version: '1.0.0',
    register: async (server: Hapi.Server, options: IPluginOptions) => {
      const apmOptions: ApmOptions = options.apm || {};
      if (!apmOptions.name || !apmOptions.url) {
        server.log('Warn', 'APM options are required');
        return;
      }

      apm.start({
        serviceName: apmOptions.name,
        serverUrl: apmOptions.url,
        verifyServerCert: false
      });

      server.ext(
        'onPreHandler',
        (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
          // request.route.fingerprint
          let path = request.route.path;
          if (apmOptions.pathReplace === true) {
            const matchParams = path.match(/\{\w+\}/g) || [];
            for (const param of matchParams) {
              path = path.replace(param, request.params[param.substring(1, param.length-1)]);
            }
          }
          const routeApm =
            request.route.method.toUpperCase() + ' ' + path;

          apm.setTransactionName(routeApm);

          return h.continue;
        }
      );
    }
  };
};
