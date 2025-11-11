/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  branches: [{ name: 'main' }, { name: 'next', prerelease: 'next' }],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/gitlab',
    // NPM is only use to update the package.json, we publish via a script publish.mts
    [
      '@semantic-release/npm',
      {
        npmPublish: false
      }
    ],
    [
      '@semantic-release/exec',
      {
        prepareCmd:
          'npm run pre-release ${nextRelease.version} && npm run build',
        publishCmd: 'npm run publish ${nextRelease.version}'
      }
    ],
    [
      '@semantic-release/git',
      { assets: ['packages/**/*.*', 'package.json', 'package-lock.json'] }
    ]
  ]
};
