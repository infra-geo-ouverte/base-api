import * as Hapi from '@hapi/hapi';
import * as Joi from 'joi';
import { IPlugin, IPluginOptions, getPlugin } from '../plugins';
import { failAction } from '../utils';
import { Config, IServerConfiguration } from '../configurations';
import { database } from './database';

export interface IRoute {
  init(server: Hapi.Server): void;
}

const loadPlugins = async (configs: IServerConfiguration, server: Hapi.Server) => {
  //  Setup Hapi Plugins
  const plugins: string[] = configs.plugins || [];
  const pluginOptions: IPluginOptions = configs.pluginsOptions || {};
  pluginOptions.database = database;
  pluginOptions.configs = configs;

  await plugins.forEach(async (pluginName: string) => {
    const plugin: IPlugin = getPlugin(pluginName);
    const version = plugin.version;
    const name = plugin.name;
    server.log('info', `Register Plugin ${name} v${version}`);
    await plugin.register(server, pluginOptions);
  });
  server.log('info', 'Plugins loaded');
};

const loadRoutes = async (configs: IServerConfiguration, server: Hapi.Server) => {
  server.log('info', 'Routes loading');
  const routes: string[] = configs.routes || [];
  await routes.forEach(async (routeName: string) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Route: IRoute = require(`${Config.getBasePath()}/${routeName}`);
    await Route.init(server);
  });
  server.log('info', 'Routes loaded', Date.now());
};

let serverHapi: Hapi.Server;

export class Server {
  static getServer() {
    return serverHapi;
  }

  static async init(configs: IServerConfiguration): Promise<Hapi.Server> {
    const port = process?.env?.port || configs.port;
    let redisCacheConfig: Hapi.ServerOptionsCache;
    if (configs.cache && configs.cache.engine === 'redis') {
      redisCacheConfig = {
        provider: {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          constructor: require('@hapi/catbox-redis').Engine,
          options: {
            host: configs.cache.host,
            partition: configs.cache.partition,
            port: configs.cache.port || 6379,
            db: configs.cache.db,
            tls: configs.cache.tls ? {} : undefined,
            sentinels: configs.cache.sentinels,
            sentinelName: configs.cache.sentinelName
          } as unknown
        }
      };
    }

    serverHapi = new Hapi.Server({
      port: port,
      host: configs.host || 'localhost',
      router: {
        stripTrailingSlash: true,
        isCaseSensitive: false
      },
      state: {
        ignoreErrors: true
      },
      cache: redisCacheConfig,
      routes: {
        cache: {
          expiresIn: configs.routesOptions?.clientCache?.expiresIn || 86400 * 1000 // 24 hour
        },
        payload: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          multipart: true as any
        },
        security: {
          hsts: configs.routesOptions?.security?.hsts || true,
          xframe: configs.routesOptions?.security?.xframe || 'deny',
          xss: configs.routesOptions?.security?.xss || 'enabled'
        },
        validate: {
          failAction: failAction(),
          options: {
            stripUnknown: true
          }
        }
      }
    });

    serverHapi.validator(Joi);

    await database.initDatabase(serverHapi);
    await loadPlugins(configs, serverHapi);
    await loadRoutes(configs, serverHapi);

    return serverHapi;
  }

  static async start() {
    const server = await Server.init(Config.getServerConfig());
    await server.start();
    server.log('info', `Running environment ${process.env.NODE_ENV || 'dev'}`);
    server.log('info', `Server running at: ${server.info.uri}`);
    if (process.send) {
      process.send('ready');
    }

    process.on('unhandledRejection', (err) => {
      console.error(err);
      process.exit(1);
    });
  }
}
