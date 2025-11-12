import { readFileSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import { PATHS } from './paths.mts';

export interface IPackageJson {
  name: string;
  version: string;
  main?: string;
  module?: string;
  typings?: string;
  workspaces?: string[];
  exports: IPackageJsonExports;
  scripts?: { [key: string]: string };
  dependencies?: { [key: string]: string };
  peerDependencies?: { [key: string]: string };
  devDependencies?: { [key: string]: string };
}

type IPackageJsonExports = {
  [key: string]: string | { [key: string]: string };
};

export async function formatPackageJson(packageName: string) {
  const packageJSON = readPackageJson(packageName);

  delete packageJSON.scripts;
  delete packageJSON.devDependencies;
  delete packageJSON.workspaces;

  packageJSON.main = 'public-api.js';
  packageJSON.typings = 'public-api.d.ts';

  packageJSON.exports = formatExports(packageJSON.exports ?? {});

  await setDistributionVersion(packageJSON);

  const path = join(PATHS.dist, packageName, 'package.json');
  await writeFile(path, JSON.stringify(packageJSON, null, 2), 'utf-8');
}

async function setDistributionVersion(
  packageJSON: IPackageJson
): Promise<void> {
  const { dependencies, peerDependencies, version } = packageJSON;
  if (peerDependencies) {
    Object.keys(peerDependencies).forEach((key) => {
      if (key.includes('@igo2')) {
        peerDependencies[key] = version;
      }
    });
  }

  if (dependencies) {
    Object.keys(dependencies).forEach((key) => {
      if (key.includes('@igo2')) {
        dependencies[key] = version;
      }
    });
  }
}

function formatExports(exports: IPackageJsonExports) {
  const formatted: IPackageJsonExports = {};

  for (const [key, value] of Object.entries(exports)) {
    if (typeof value === 'object' && value !== null) {
      // Process each export entry, preserving all properties
      const formattedEntry: any = {};

      for (const [propKey, propValue] of Object.entries(value)) {
        if (propKey === 'import' || propKey === 'default') {
          // Convert .ts paths to .js, remove src folder and rename import to default
          formattedEntry['default'] = convertPath(propValue);
        } else if (propKey === 'types') {
          // Keep types property as-is
          formattedEntry[propKey] = propValue;
        } else {
          // Pass through all other properties
          formattedEntry[propKey] = propValue;
        }
      }

      // Ensure types property exists for non-package.json exports
      if (key !== './package.json' && !formattedEntry.types) {
        const typesPath = convertPath(
          formattedEntry.import || formattedEntry.default
        )?.replace(/\.js$/, '.d.ts');
        if (typesPath) {
          formattedEntry.types = typesPath;
        }
      }

      formatted[key] = formattedEntry;
    } else {
      // Handle string values directly (shouldn't happen but be safe)
      formatted[key] = convertPath(value);
    }
  }

  // Ensure default export exists
  if (!formatted['.']) {
    formatted['.'] = {
      types: './index.d.ts',
      default: './index.js'
    };
  }

  return formatted;
}

function convertPath(path: string) {
  if (typeof path !== 'string') {
    return path;
  }

  // Replace .ts with .js
  let converted = path.replace(/\.ts$/, '.js');

  // Remove /src/ from path
  converted = converted.replace(/\/src\//, '/');

  // Handle src/ at the beginning
  converted = converted.replace(/^src\//, '');

  return converted;
}

function readPackageJson(name: string): IPackageJson {
  const path = resolve(PATHS.packages, name, 'package.json');
  const body = readFileSync(path, 'utf-8');
  return JSON.parse(body);
}
