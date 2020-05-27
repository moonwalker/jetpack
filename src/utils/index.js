const { execSync } = require('child_process');

const { ENV, NAMESPACE, RELEASE, API_HOST, TRACK_HOST } = require('../constants');
const debug = require('./debug');
const perf = require('./perf');

// @TODO use src/constants
const getCommitId = () =>
  process.env.COMMIT || execSync('git rev-parse --short HEAD').toString().trim();

const hasTrailingSlash = (pathname) => {
  return pathname.length > 1 && pathname.substr(-1) === '/';
};

const hasLocale = (path, localesRegex) => {
  const m = path.match(localesRegex);
  return m && m.length && m[1];
};

const stripUndefined = (path) => {
  const ms = path.match(/^(.*)\/undefined\//i);
  if (ms) return ms[1];
  return null;
};

const stripTrailingSlash = (pathname) => {
  if (!hasTrailingSlash(pathname)) {
    return pathname;
  }

  return pathname.slice(0, -1);
};

const getEnvMiddleware = () => (_, reply) => {
  const config = { ENV, NAMESPACE, RELEASE, API_HOST, TRACK_HOST };

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
  getCommitId,
  hasLocale,
  hasTrailingSlash,
  stripTrailingSlash,
  stripUndefined
};
