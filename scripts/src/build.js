import { copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { $ } from 'execa';
import { formatPackageJson } from './config/package.js';
import { PATHS } from './config/paths.js';

await $({ stdio: 'inherit' })`rimraf build`;
await $({ stdio: 'inherit' })`npm run tsc`;

await formatPackageJson();

await copyFile(resolve(PATHS.root, 'README.md'), `${PATHS.build}/README.md`);
