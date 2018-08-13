const { execSync } = require('child_process');
const debug = require('./debug');
const perf = require('./perf');

const getCommitId = () => execSync('git rev-parse HEAD').toString().trim();

module.exports = {
  debug,
  perf,
  getCommitId
};
