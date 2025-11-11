import { Config } from '../configurations';
import { default as apm } from './apm';
import { default as devErrors } from './dev-errors';
import { default as health } from './health';
import { default as logger } from './logger';
import { IPlugin } from './plugin.interface';
import { default as route } from './route';
import { default as sanitizer } from './sanitizer';
import { default as swagger } from './swagger';

export const PLUGINS: Record<string, () => IPlugin> = {
  apm,
  'dev-errors': devErrors,
  health,
  logger,
  route,
  sanitizer,
  swagger
};

export async function getPlugin(name: string): Promise<IPlugin> {
  if (PLUGINS[name]) {
    return PLUGINS[name]();
  }
  const plugin = await import(`${Config.getBasePath()}/plugins/${name}`);
  return plugin.default();
}

export * from './apm';
export * from './dev-errors';
export * from './health';
export * from './logger';
export * from './route';
export * from './sanitizer';
export * from './swagger';
export * from './plugin.interface';
