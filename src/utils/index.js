const { execSync } = require('child_process')
const debug = require('./debug')
const perf = require('./perf')

const getCommitId = () => process.env.COMMIT || execSync('git rev-parse --short HEAD').toString().trim()

const hasTrailingSlash = pathname => {
  return pathname.length > 1 && pathname.substr(-1) == '/'
}

const hasLocale = (path, localesRegex) => {
  return localesRegex.test(path);
}

const stripUndefined = path => {
  const ms = path.match(/^(.*)\/undefined\//i);
  if (!!ms) return ms[1];
  return null;
}

const stripTrailingSlash = pathname => {
  if (hasTrailingSlash(pathname)) {
    pathname = pathname.slice(0, -1)
  }
  return pathname
}

const getEnvMiddleware = () => (_, reply) => {
  const config = {
    ENV: process.env.ENV || process.env.env || '',
    NAMESPACE: process.env.NAMESPACE || 'default',
    RELEASE: process.env.COMMIT || ''
  };

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
}
