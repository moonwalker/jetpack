const { execSync } = require('child_process');
const debug = require('./debug');
const perf = require('./perf');

const getCommitId = () => process.env.COMMIT || execSync('git rev-parse --short HEAD').toString().trim();

module.exports = {
  debug,
  perf,
  getCommitId
};
