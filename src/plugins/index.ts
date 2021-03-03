import { IPlugin } from './plugin.interface';
import { default as apm} from './apm';
import { default as devErrors} from './dev-errors';
import { default as logger} from './logger';
import { default as sanitizer} from './sanitizer';
import { default as swagger} from './swagger';

const PLUGINS: {[key: string]: () => IPlugin} = {
  apm,
  'dev-errors': devErrors,
  logger,
  sanitizer,
  swagger
};

exports.PLUGINS = PLUGINS;

export function getPlugin(name: string) {
  return PLUGINS[name]();
}

export * from './apm';
export * from './dev-errors';
export * from './logger';
export * from './sanitizer';
export * from './swagger';
export * from './plugin.interface';
