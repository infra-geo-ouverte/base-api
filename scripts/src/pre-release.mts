import { readdirSync } from 'node:fs';

import { $ } from 'execa';

import { PATHS } from './config/paths.mts';

(async () => {
  console.log('Packages Pre-publish');

  const [_nodePath, _scriptPath, argVersion] = process.argv;
  const version = argVersion ?? process.env.npm_new_version;

  const folders = readdirSync(PATHS.packages);

  // Edit packages version and the Core version.ts file
  console.log('Propagate the version to sub-packages');
  for (const folder of folders) {
    await $({
      stdio: 'inherit'
    })`npm pkg set version=${version} -w @igo2/${folder}`;
  }

  console.log('Version update complete');
})();
