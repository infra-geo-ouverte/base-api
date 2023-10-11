/* eslint @typescript-eslint/no-explicit-any: 1 */

import * as Hapi from '@hapi/hapi';

export interface IPluginOptions {
  [key: string]: any;
}

export interface IPlugin {
  name: string;
  version: string;
  register(server: Hapi.Server, options?: IPluginOptions): Promise<void>;
}
