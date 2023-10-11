import * as Hapi from '@hapi/hapi';

export interface IPluginOptions {
  global?: {
    baseHref: string;
  }
  [key: string]: unknown;
}

export interface IPlugin {
  name: string;
  version: string;
  register(server: Hapi.Server, options?: IPluginOptions): Promise<void>;
}
