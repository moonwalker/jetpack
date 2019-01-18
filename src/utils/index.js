const { execSync } = require('child_process')
const debug = require('./debug')
const perf = require('./perf')

const getCommitId = () => process.env.COMMIT || execSync('git rev-parse --short HEAD').toString().trim()

const hasTrailingSlash = pathname => {
  return pathname.length > 1 && pathname.substr(-1) == '/'
}

const hasLocale = path => {
  return /^\/[a-z]{2}(?:-[a-z]{2})?\/.*/i.test(path);
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
  stripTrailingSlash
}
