const { execSync } = require('child_process')
const debug = require('./debug')
const perf = require('./perf')

const getCommitId = () => process.env.COMMIT || execSync('git rev-parse --short HEAD').toString().trim()

const hasTrailingSlash = pathname => {
  return pathname.length > 1 && pathname.substr(-1) == '/'
}

const stripTrailingSlash = pathname => {
  if (hasTrailingSlash(pathname)) {
    pathname = pathname.slice(0, -1)
  }
  return pathname
}

module.exports = {
  debug,
  perf,
  getCommitId,
  hasTrailingSlash,
  stripTrailingSlash
}
