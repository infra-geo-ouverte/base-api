import { join } from 'node:path';

import { access, constants, copyFile } from 'fs/promises';

import { formatPackageJson } from './config/package.mts';
import { PATHS } from './config/paths.mts';

(async () => {
  const [_nodePath, _scriptPath, name] = process.argv;

  await formatPackageJson(name);

  await copyReadme(name);
})();

async function copyReadme(packageName: string) {
  const distPath = join(PATHS.dist, packageName);
  const filePath = join(PATHS.packages, packageName, 'README.md');

  try {
    await access(filePath, constants.F_OK);

    await copyFile(filePath, `${distPath}/README.md`);
    console.log(`Successfully copied README.md for ${packageName}`);
  } catch (err) {
    if ((err as any).code === 'ENOENT') {
      console.log(
        `Warning: README.md not found for ${packageName}. Skipping copy.`
      );
    } else {
      // Re-throw other errors (e.g., permission issues, path issues)
      throw err;
    }
  }
}
