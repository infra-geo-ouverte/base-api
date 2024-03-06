import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { PATHS } from './paths.js';

export async function formatPackageJson() {
  const packageJSON = readPackageJson();

  delete packageJSON.scripts;
  delete packageJSON.devDependencies;
  delete packageJSON.workspaces;

  packageJSON.main = 'index.js';
  packageJSON.typings = 'index.d.ts';
  packageJSON.exports = {
    ...packageJSON.exports,
    ...{
      '.': {
        ...(packageJSON.exports?.['.'] ?? {}),
        types: './index.d.ts',
        default: './index.js'
      }
    }
  };
  await writeFile(`${PATHS.build}/package.json`, JSON.stringify(packageJSON, null, 2), 'utf-8');
}

function readPackageJson() {
  const path = resolve(PATHS.root, 'package.json');
  const body = readFileSync(path, 'utf-8');
  return JSON.parse(body);
}
