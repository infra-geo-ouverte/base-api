import { readdirSync } from 'node:fs';
import { join } from 'node:path';

import { $ } from 'execa';

import { PATHS } from './config/paths.mts';

export type PreReleaseTag = 'rc' | 'next' | 'beta' | 'alpha';

export const RELEASE_TAGS: PreReleaseTag[] = ['rc', 'next', 'beta', 'alpha'];

(async () => {
  const [_nodePath, _scriptPath, argVersion] = process.argv;
  const version = argVersion ?? process.env.npm_new_version;

  console.log('Publishing packages...');

  const folders = readdirSync(PATHS.packages);
  for (const name of folders) {
    console.log(`Start publishing @igo2/${name}@${version}`);
    await publishPackage(name, version);
    console.log(`@igo2/${name}@${version} was published successfully`);
  }
})();

async function publishPackage(name: string, version: string): Promise<void> {
  const tag = RELEASE_TAGS.find((tag) => version.includes(tag));

  let command = `npm publish ${join(PATHS.dist, name)} --access public`;

  if (tag) {
    command += ` --tag ${tag}`;
  }
  console.log(command);

  // shell true is mandotary to publish on Github Actions
  await $({ stdio: 'inherit', shell: true })`${command}`;
}
