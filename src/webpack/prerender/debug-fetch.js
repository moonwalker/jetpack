const nodeFetch = require('node-fetch');
const { merge, omit } = require('lodash');
const Cache = require('node-cache');
const fetchCached = require('fetch-cached').default;

const debug = require('../debug');

const USER_AGENT = 'node-fetch/1.0 (jetpack/prerender;+https://github.com/bitinn/node-fetch)';
const DEBUG_PREFIX = ['prerender', 'route', 'fetch'];

global.workerFetchCount = 0;

const cache = new Cache();

const loggedFetch = (url, options) => {
  const body = JSON.parse(options.body);

  global.workerFetchCount += 1;

  const fetchOptions = merge({}, options, {
    headers: {
      'User-Agent': USER_AGENT
    },
    timeout: 10000
  });

  const log = debug(...DEBUG_PREFIX, body.operationName);
  log('Start %o', omit(body, 'query'));

  return nodeFetch(url, fetchOptions)
    .then((res) => {
      log('Done');
      return res;
    });
};

global.fetch = fetchCached({
  fetch: loggedFetch,
  cache: {
    get: k => cache.get(k),
    set: (k, v) => cache.set(k, v),
  }
});
