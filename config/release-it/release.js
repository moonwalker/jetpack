const { merge } = require('lodash');
const config = require('./common');

module.exports = merge({}, config, {
  git: {
    commit: false,
    push: false,
    tag: false,
    requireCleanWorkingDir: false,
    requireUpstream: false
  },
  npm: {
    publish: true
  }
});