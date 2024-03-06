import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const ROOT_LEVEL = '../../../';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), ROOT_LEVEL);

const resolveRoot = (relativePath) => {
  return resolve(ROOT, relativePath);
};

export const PATHS = {
  build: resolveRoot('build'),
  nodeModules: resolveRoot('node_modules'),
  root: ROOT
};
