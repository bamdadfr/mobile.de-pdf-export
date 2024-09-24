/* eslint-disable no-template-curly-in-string */
module.exports = {
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
      },
    ],
    [
      '@semantic-release/exec',
      {
        prepareCmd: 'pnpm build:increment ${nextRelease.version} && pnpm build && pnpm build:zip ${nextRelease.version}',
      },
    ],
    [
      'semantic-release-chrome',
      {
        asset: 'mobile.de-pdf-export-${nextRelease.version}.zip',
        extensionId: 'fnjfhjjofjobpefcbcajbbklljjhnnlm',
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: [
          'mobile.de-pdf-export-${nextRelease.version}.zip',
        ],
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json', 'src/manifest.json'],
        message:
          'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
  ],
};
