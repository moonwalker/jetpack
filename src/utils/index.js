const { execSync } = require('child_process');

const { ENV, NAMESPACE, CLIENT_RELEASE, API_HOST, TRACK_HOST } = require('../constants');
const debug = require('./debug');
const perf = require('./perf');

// @TODO use src/constants
const getCommitId = () =>
  process.env.COMMIT || execSync('git rev-parse --short HEAD').toString().trim();

const getEnvMiddleware = () => (_, reply) => {
  const config = { ENV, NAMESPACE, RELEASE: CLIENT_RELEASE, API_HOST, TRACK_HOST };

  reply
    .header('Cache-Control', 'no-store, no-cache, must-revalidate')
    .header('Expires', 'Thu, 01 Jan 1970 00:00:00 GMT')
    .header('Content-Type', 'application/javascript')
    .send(`window.APP_CONFIG = ${JSON.stringify(config)}`);
};

module.exports = {
  debug,
  perf,
  getEnvMiddleware,
  getCommitId
};
