const { merge } = require('lodash');
const config = require('./common');

module.exports = merge({}, config, {
  git: {
    // eslint-disable-next-line no-template-curly-in-string
    commitMessage: ':package: release ${version}'
  },
  github: {
    ...config.github,
    release: true
  },
  plugins: {
    '@release-it/conventional-changelog': {
      preset: 'angular'
    }
  }
});
