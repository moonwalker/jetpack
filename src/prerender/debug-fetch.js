const nodeFetch = require('node-fetch');
const { merge, omit } = require('lodash');

const { debug } = require('../utils');

const USER_AGENT = 'node-fetch/1.0 (jetpack/prerender;+https://github.com/bitinn/node-fetch)';
const DEBUG_PREFIX = ['prerender', 'route', 'fetch'];

const loggedFetch = (url, options) => {
  const body = JSON.parse(options.body);

  global.workerFetchCount += 1;

  const fetchOptions = merge({}, options, {
    headers: {
      'User-Agent': USER_AGENT
    },
    timeout: 30 * 1000
  });

  const log = debug(...DEBUG_PREFIX, body.operationName);
  log('Start %o', omit(body, 'query'));

  return nodeFetch(url, fetchOptions)
    .then((res) => {
      log('Done');
      return res;
    })
    .catch((err) => {
      console.error('Error on %s %O', url, body);
      throw err;
    });
};

global.fetch = loggedFetch;
