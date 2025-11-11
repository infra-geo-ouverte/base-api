import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { PinoLoggerOptions } from 'fastify/types/logger';

import { ILoggerEnv } from './logger.interface';

export const loggerConfig: PinoLoggerOptions = {
  level: 'info',
  redact: ['headers.authorization', 'headers.key'],
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: process.env.ENVIRONMENT === 'local' ? true : false,
      translateTime: 'SYS:standard',
      singleLine: true
    }
  }
};

export const loggerPlugin: FastifyPluginAsync<ILoggerEnv> = fastifyPlugin(
  async (instance: FastifyInstance, options: ILoggerEnv): Promise<void> => {
    const { LOG_LEVEL, LOG_EXCLUDE_IPS, LOG_EXCLUDE_USERS, LOG_EXCLUDE_PATHS } =
      options;

    instance.log.level = LOG_LEVEL;

    const excludeLog = (ip?: string, username?: string, path?: string) => {
      return (
        (ip && LOG_EXCLUDE_IPS && LOG_EXCLUDE_IPS.includes(ip)) ||
        (username &&
          LOG_EXCLUDE_USERS &&
          LOG_EXCLUDE_USERS.includes(username)) ||
        (path && LOG_EXCLUDE_PATHS && LOG_EXCLUDE_PATHS.includes(path))
      );
    };

    instance.addHook('onRequest', (req, reply, done) => {
      try {
        req.log.debug(
          {
            method: req.raw.method,
            url: req.raw.url,
            id: req.id,
            ip: req.ip,
            headers: req.headers
          },
          'Received request'
        );
      } catch (err) {
        req.log.error(err, 'Hook onRequest error');
      }
      done();
    });

    instance.addHook('onResponse', (req, reply, done) => {
      try {
        const ip = req.raw.headers['x-real-ip']
          ? (req.raw.headers['x-real-ip'] as string)
          : req.ip;
        const username = req.raw.headers['x-consumer-username'] as string;

        let logFct = excludeLog(ip, username, req.raw.url)
          ? req.log.debug
          : req.log.info;

        const responseTime = reply.elapsedTime;
        let status = `${reply.statusCode}`;

        if (reply.statusCode >= 500) {
          logFct = req.log.error;
          status = `${reply.statusCode}-${reply.raw.statusMessage}`;
        } else if (reply.statusCode >= 400) {
          logFct = req.log.warn;
          status = `${reply.statusCode}-${reply.raw.statusMessage}`;
        }

        logFct.call(
          req.log,
          `${ip}${username ? ` - ${username}` : ''} [response] ${req.raw.method} ${
            req.raw.url
          } (${status}) ${responseTime.toFixed(2)} ms`
        );

        req.log.debug(
          {
            statusCode: reply.statusCode,
            statusMessage: reply.raw.statusMessage,
            responseTime: reply.elapsedTime
          },
          'Request completed'
        );
      } catch (err) {
        req.log.error(err, 'Hook onResponse error');
      }
      done();
    });

    instance.addHook('onError', (req, _reply, error, done) => {
      req.log.error(error, 'Request error');
      done();
    });
  }
);
