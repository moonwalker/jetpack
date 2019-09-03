const { merge } = require('lodash');
const config = require('./common');

module.exports = merge({}, config, {
  git: {
    // eslint-disable-next-line no-template-curly-in-string
    commitMessage: 'DROP - release ${version}\n[ci skip]'
  }
});