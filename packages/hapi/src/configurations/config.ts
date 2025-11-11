import { ObjectUtils } from '@igo2/base-api';
import nconf from 'nconf';

import {
  IConfigOptions,
  IDataConfiguration,
  IDatabaseProxyConfiguration,
  IMailConfiguration,
  IServerConfiguration
} from './config.interface';

let configs: nconf.Provider;
let path: string;

export class Config {
  private static defaultsOptions: IConfigOptions = {
    argv: {
      parseValues: true
    },
    env: {
      separator: '__',
      prefixKey: 'igo',
      removePrefixKey: true,
      parseValues: true
    }
  };

  static readConfig(
    basePath: string,
    relPath: string,
    opts: IConfigOptions = {}
  ): nconf.Provider {
    path = basePath;
    opts = ObjectUtils.mergeDeep(this.defaultsOptions, opts) as IConfigOptions;

    configs = nconf
      .argv({
        parseValues: opts.argv?.parseValues
      })
      .env({
        separator: opts.env?.separator,
        parseValues: opts.env?.parseValues,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transform: (obj: any) => {
          const regex = new RegExp(
            `^${opts.env?.prefixKey}(${opts.env?.separator}|:)`
          );
          const match = obj.key.match(regex);
          if (!match) {
            return false;
          }
          if (opts.env?.removePrefixKey) {
            obj.key = obj.key.replace(match[0], '');
          }
          return obj;
        }
      })
      .file({
        file: basePath + '/' + relPath
      })
      .overrides(opts.overrides)
      .defaults(opts.defaults);

    return configs;
  }

  static getConfig(key?: string) {
    return key ? configs?.get(key) : configs;
  }

  static getBasePath() {
    return path;
  }

  static getDatabaseConfig(): IDataConfiguration {
    return configs?.get('database');
  }

  static getDatabaseProxyConfig(): IDatabaseProxyConfiguration {
    return configs?.get('databaseProxy');
  }

  static getServerConfig(): IServerConfiguration {
    return configs?.get('server');
  }

  static getMailConfig(): IMailConfiguration {
    return configs?.get('mail');
  }
}
