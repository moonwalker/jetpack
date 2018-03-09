const os = require('os');
const { chunk } = require('lodash');
const async = require('async');
const debug = require('debug');

const CHUNK_SIZE = 100;
const PARALLEL_LIMIT = os.cpus().length - 1;

module.exports = routes => new Promise((resolve) => {
  const worker = require('./worker'); // eslint-disable-line
  const routeChunks = chunk(routes, CHUNK_SIZE);
  const log = debug('jetpack:prerender:all');

  log(`Start prerendering ${routes.length} routes`);

  async.parallelLimit(
    routeChunks.map((routeChunk, chunkId) => nextTask =>
      worker({ routes: routeChunk, id: chunkId }, nextTask)),
    PARALLEL_LIMIT,
    () => {
      log('Done prerendering');
      resolve();
    }
  );
});
