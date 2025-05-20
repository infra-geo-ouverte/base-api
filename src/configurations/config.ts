import nconf from 'nconf';

import { ObjectUtils } from '../utils/object-utils';
import {
  IDataConfiguration,
  IDatabaseProxyConfiguration,
  IServerConfiguration,
  IMailConfiguration,
  IConfigOptions
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

  static readConfig(basePath: string, relPath: string, opts: IConfigOptions = {}): nconf.Provider {
    path = basePath;
    opts = ObjectUtils.mergeDeep(this.defaultsOptions, opts);

    configs = nconf
      .argv({
        parseValues: opts.argv.parseValues
      })
      .env({
        separator: opts.env.separator,
        parseValues: opts.env.parseValues,
        transform: (obj) => {
          const regex = new RegExp(`^${opts.env.prefixKey}(${opts.env.separator}|:)`);
          const match = obj.key.match(regex);
          if (!match) {
            return false;
          }
          if (opts.env.removePrefixKey) {
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
