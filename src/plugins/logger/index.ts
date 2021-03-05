import * as Hapi from '@hapi/hapi';

import { IPlugin, IPluginOptions } from '../plugin.interface';
import { LoggerOptions } from './logger.options';

function preformatter(event: any) {
    if (event.req) {
      event.id = event.req.id ? ` (${event.pid}:${event.req.id.split(':').pop()})` : '';
      const headers = event.req.headers ? event.req.headers : {};
      event.ip = headers['x-real-ip'] ? ` - ${headers['x-real-ip']}` : '';
      event.username = headers['x-consumer-username'] ? ` - ${headers['x-consumer-username']}` : '';
    }

    return event;
  }

export default (): IPlugin => {
  return {
    name: 'Logger',
    version: '2.0.0',
    register: async (server: Hapi.Server, options: IPluginOptions = {}) => {
      const opts: LoggerOptions = options.logger || {
        colored: true,
        preformatter: preformatter,
        handleUncaught: true,
        pino: {
          level: 'info'
        },
        hapiPino: {
          logPayload: false,
          logQueryParams: true,
          logRouteTags: true,
          logRequestStart: false,
          ignorePaths: [],
          ignoreTags: [],
          ignoreFunc: (options, request) => {
            const ip = request.headers['x-real-ip'];
            return opts.exclude && opts.exclude.ips && opts.exclude.ips.includes(ip);
          }
        }
      };

      // https://github.com/felixheck/laabr/blob/master/docs/tokens-formats-presets.md
      const laabr = require('laabr');
      laabr.format('log', ':time[iso] :level :message');
      laabr.format('request', ':time[iso]:get[id] :tags :get[ip]:get[username] :message')
      laabr.format('response', ':time[iso]:get[id] :tags :method:get[ip]:get[username] :url :status :get[queryParams] (:responseTime ms)')
      laabr.format('onPostStart', ':time[iso] :level :message at: :host[uri]')
      laabr.format('onPostStop', ':time[iso] :level :message at: :host[uri]')

      // laabr.format('request-error', 'request-error...');
      // laabr.format('uncaught', 'uncaught...');

      await server.register({
        plugin: laabr,
        options: opts
      });
    }
  };
};
