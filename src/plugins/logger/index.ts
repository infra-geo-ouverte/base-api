import Hapi from '@hapi/hapi';

import { IPlugin, IPluginOptions } from '../plugin.interface';
import { LoggerOptions, LoggerLevel } from './logger.options';
import HapiPino from 'hapi-pino';

export default (): IPlugin => {
  return {
    name: 'Logger',
    version: '2.0.0',
    register: async (server: Hapi.Server, options: IPluginOptions = {}) => {
      const loggerOptions: LoggerOptions = Object.assign({ level: LoggerLevel.info }, options.logger);

      const pinoOptions: HapiPino.Options = {
        level: loggerOptions.level,
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
            singleLine: true,
          }
        },
        logPayload: false,
        logQueryParams: true,
        logRouteTags: true,
        logRequestStart: false,
        ignorePaths: [],
        ignoreTags: [],
        ignoreFunc: (_ignoreOptions, request) => {
          const ip = request.headers ? request.headers['x-real-ip'] : undefined;
          return loggerOptions.exclude && loggerOptions.exclude.ips && loggerOptions.exclude.ips.includes(ip);
        }
      };

      return server.register({
        plugin: HapiPino,
        options: pinoOptions
      });
    }
  };
};
