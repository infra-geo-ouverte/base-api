import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_LEVEL = '../../../';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), ROOT_LEVEL);

const resolveRoot = (relativePath: string) => {
  return resolve(ROOT, relativePath);
};

export const PATHS = {
  dist: resolveRoot('dist'),
  packages: resolveRoot('packages'),
  nodeModules: resolveRoot('node_modules'),
  root: ROOT
};
