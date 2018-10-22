const { execSync } = require('child_process');
const debug = require('./debug');
const perf = require('./perf');

const getCommitId = () => process.env.COMMIT || execSync('git rev-parse --short HEAD').toString().trim();

const stripTrailingSlash = url => {
  if (url.substr(-1) == '/' && url.length > 1) {
    url = url.slice(0, -1);
  }
  return url;
}

module.exports = {
  debug,
  perf,
  getCommitId,
  stripTrailingSlash
};
