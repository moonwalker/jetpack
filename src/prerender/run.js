const path = require('path');
const os = require('os');
const fs = require('fs');
const { chunk } = require('lodash');
const async = require('async');
const workerFarm = require('worker-farm');

const { debug, perf } = require('../utils');
const { paths } = require('../webpack/defaults');

const CHUNK_SIZE = process.env.JETPACK_PRERENDER_CHUNK_SIZE || 500;
const WORKER_COUNT =
  process.env.JETPACK_PRERENDER_WORKER_COUNT || Math.min(os.cpus().length - 1, 8);
const CONCURRENT_CONNECTIONS = process.env.JETPACK_PRERENDER_CONCURRENT_CONNECTIONS || 20;
const ROUTES_FILTER = process.env.JETPACK_PRERENDER_ROUTES_FILTER;

const NAMESPACE = 'prerender';

const getAssetSource = (filepath) => {
  const stylesheetFilepath = path.join(paths.output.path, filepath);
  return fs.readFileSync(stylesheetFilepath, 'utf8');
};

const processChunk = (files) => ({
  ...files,
  // Add CSS source if .css is present
  ...(files.css ? { style: getAssetSource(files.css) } : {})
});

const processAssets = (assetsFilepath) => {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const assetsData = require(assetsFilepath);

  return Object.entries(assetsData).reduce(
    (aggregated, [name, files]) => ({
      ...aggregated,
      [name]: processChunk(files)
    }),
    {}
  );
};

const filterRoutes = (routes, filter) => {
  const pattern = new RegExp(filter);
  const isMatching = (route) => pattern.test(route.path);

  return routes.filter(isMatching);
};

const checkBuildArtifacts = (...filepaths) => {
  let artifacts = [];

  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    artifacts = filepaths.map((filepath) => require.resolve(filepath));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Build artifacts are requird, run `jetpack build` before!\n', err);
    process.exit(1);
  }

  return artifacts;
};

module.exports = (allRoutes) =>
  new Promise((resolve) => {
    const [assetsFilepath, renderFilepath] = checkBuildArtifacts(
      path.join(paths.assets.path, paths.assets.filename),
      paths.render.file
    );

    const routes = ROUTES_FILTER ? filterRoutes(allRoutes, ROUTES_FILTER) : allRoutes;

    const log = debug(NAMESPACE);
    log(
      'Start prerendering %s/%s routes%s',
      routes.length,
      allRoutes.length,
      ` (${ROUTES_FILTER})`
    );
    log('Worker count %d', WORKER_COUNT);
    log('Concurrent connections %d', CONCURRENT_CONNECTIONS);

    perf.start(NAMESPACE);

    const worker = workerFarm(require.resolve('./worker')); // eslint-disable-line
    const routeChunks = chunk(routes, CHUNK_SIZE);
    const workersCount = Math.ceil(routes.length / CHUNK_SIZE);

    const assets = processAssets(assetsFilepath);

    async.parallelLimit(
      routeChunks.map((routeChunk, chunkId) => (nextTask) =>
        worker(
          {
            renderFilepath,
            routes: routeChunk,
            id: chunkId + 1,
            concurrentConnections: CONCURRENT_CONNECTIONS,
            workersCount,
            assets
          },
          nextTask
        )
      ),
      WORKER_COUNT,
      (err, stats) => {
        log('Done prerendering');

        workerFarm.end(worker);

        perf.end(NAMESPACE).then((duration) => {
          const result = {
            duration,
            workers: stats
          };

          return resolve({
            err,
            result
          });
        });
      }
    );
  });

module.exports.checkBuildArtifacts = checkBuildArtifacts;
module.exports.processAssets = processAssets;
