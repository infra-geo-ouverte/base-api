import * as nconf from 'nconf';

import { IDataConfiguration, IServerConfiguration, IMailConfiguration } from './config.interface';

let configs: nconf.Provider;
let path: string;

export class Config {

  static readConfig(basePath: string, relPath: string) {
    path = basePath;
    configs =  new nconf.Provider({
      env: true,
      argv: true,
      store: {
        type: 'file',
        file: basePath + '/' + relPath
      }
    });
  }

  static getConfig() {
    return configs;
  }

  static getBasePath() {
    return path;
  }

  static getDatabaseConfig(): IDataConfiguration {
    return configs?.get('database');
  }

  static getServerConfig(): IServerConfiguration {
    return configs?.get('server');
  }

  static getMailConfig(): IMailConfiguration {
    return configs?.get('mail');
  }
}
