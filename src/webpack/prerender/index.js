const path = require('path');
const os = require('os');
const fs = require('fs');
const { chunk } = require('lodash');
const async = require('async');
const workerFarm = require('worker-farm');

const debug = require('../debug');
const { paths } = require('../defaults');

const CHUNK_SIZE = 500;
const WORKER_COUNT = process.env.JETPACK_PRERENDER_WORKER_COUNT ||
  Math.min(os.cpus().length - 1, 8);
const CONCURRENT_CONNECTIONS = process.env.JETPACK_PRERENDER_CONCURRENT_CONNECTIONS || 20;

const getAssetSource = (filepath) => {
  const stylesheetFilepath = path.join(paths.output.path, filepath);
  return fs.readFileSync(stylesheetFilepath, 'utf8');
};

const processChunk = files => ({
  ...files,
  // Add CSS source if .css is present
  ...(files.css ? { style: getAssetSource(files.css) } : {})
});

const resolveAssets = () => {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const assets = require(path.join(paths.assets.path, paths.assets.filename));

  return Object.entries(assets).reduce((aggregated, [name, files]) => ({
    ...aggregated,
    [name]: processChunk(files)
  }), {});
};

module.exports = routes => new Promise((resolve) => {
  const log = debug('prerender');

  log('Start prerendering %s routes', routes.length);
  log('Worker count %d', WORKER_COUNT);
  log('Concurrent connections %d', CONCURRENT_CONNECTIONS);

  const worker = workerFarm(require.resolve('./worker')); // eslint-disable-line
  const routeChunks = chunk(routes, CHUNK_SIZE);
  const workersCount = Math.ceil(routes.length / CHUNK_SIZE);

  const assets = resolveAssets();

  async.parallelLimit(
    routeChunks.map((routeChunk, chunkId) => nextTask =>
      worker({
        routes: routeChunk,
        id: chunkId,
        concurrentConnections: CONCURRENT_CONNECTIONS,
        workersCount,
        assets
      }, nextTask)),
    WORKER_COUNT,
    () => {
      log('Done prerendering');
      workerFarm.end(worker);
      resolve();
    }
  );
});
