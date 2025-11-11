import Hapi from '@hapi/hapi';
import HapiPino from 'hapi-pino';

import { IPlugin, IPluginOptions } from '../plugin.interface';
import { LoggerLevel, LoggerOptions } from './logger.options';

export default (): IPlugin => {
  return {
    name: 'Logger',
    version: '2.0.0',
    register: async (server: Hapi.Server, options: IPluginOptions = {}) => {
      const loggerOptions: LoggerOptions = Object.assign(
        { level: LoggerLevel.info },
        options.logger
      );
      const debug =
        loggerOptions.level === LoggerLevel.debug ||
        loggerOptions.level === LoggerLevel.trace;

      const pinoOptions: HapiPino.Options = {
        level: loggerOptions.level,
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            singleLine: !debug,
            ignore: debug ? undefined : 'res,req,responseTime,queryParams.key'
          }
        },
        logPayload: debug,
        logQueryParams: true,
        logRouteTags: true,
        logRequestStart: debug,
        ignorePaths: debug ? [] : ['/health'],
        ignoreTags: debug ? [] : ['healthcheck'],
        customRequestCompleteMessage: (request, responseTime) => {
          const ip = request.headers['x-real-ip']
            ? request.headers['x-real-ip']
            : '';
          const username = request.headers['x-consumer-username']
            ? ` - ${request.headers['x-consumer-username']}`
            : '';
          return `${ip}${username} [response] ${request.method} ${request.path} ${request.raw.res.statusCode} (${responseTime}ms)`;
        },
        customRequestErrorMessage: (request, error) => {
          return error.message;
        },
        ignoreFunc: (_ignoreOptions, request) => {
          const ip = request.headers ? request.headers['x-real-ip'] : undefined;
          return (loggerOptions.exclude &&
            loggerOptions.exclude.ips &&
            loggerOptions.exclude.ips.includes(ip)) as boolean;
        }
      };

      await server.register({
        plugin: HapiPino,
        options: pinoOptions
      });
    }
  };
};
