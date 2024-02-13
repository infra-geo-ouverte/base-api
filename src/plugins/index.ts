import { IPlugin } from './plugin.interface';
import { default as apm} from './apm';
import { default as devErrors} from './dev-errors';
import { default as health} from './health';
import { default as logger} from './logger';
import { default as route} from './route';
import { default as sanitizer} from './sanitizer';
import { default as swagger} from './swagger';

import { Config } from '../configurations';

export const PLUGINS: {[key: string]: () => IPlugin} = {
  apm,
  'dev-errors': devErrors,
  health,
  logger,
  route,
  sanitizer,
  swagger
};

export function getPlugin(name: string): IPlugin {
  if (PLUGINS[name]) {
    return PLUGINS[name]();
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require(`${Config.getBasePath()}/plugins/${name}`).default();
}

export * from './apm';
export * from './dev-errors';
export * from './health';
export * from './logger';
export * from './route';
export * from './sanitizer';
export * from './swagger';
export * from './plugin.interface';
