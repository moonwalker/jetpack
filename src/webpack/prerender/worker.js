const path = require('path');
const async = require('async');
const fse = require('fs-extra');
const htmlMinifier = require('html-minifier');

require('./debug-fetch');
const debug = require('../debug');
const {
  paths,
  minimize
} = require('../defaults');

const DEBUG_SEGMENTS = ['prerender', 'worker'];

const writeHtml = (routePath) => {
  const outputFilepath = path.join(paths.output.path, routePath, 'index.html');

  return html => fse.outputFile(
    outputFilepath,
    minimize.enabled ? htmlMinifier.minify(html) : html
  );
};

module.exports = (options, done) => {
  const {
    renderFilepath,
    routes,
    id,
    workersCount,
    concurrentConnections,
    assets
  } = options;

  const log = debug(...DEBUG_SEGMENTS, `worker_${id}`);

  log(`${id}/${workersCount} (pid: ${process.pid})`);
  log(`Routes: ${routes.length}`);

  // eslint-disable-next-line import/no-dynamic-require, global-require
  const render = require(renderFilepath).default;

  const tasks = routes.map(route => (nextTask) => {
    const logRoute = debug(...DEBUG_SEGMENTS, `worker_${id}`, 'route', route.path);
    logRoute('Start');

    return render({ route, assets })
      .then(writeHtml(route.path))
      .then(() => {
        logRoute('End');
        nextTask();
      })
      .catch((err) => {
        console.error('Render error', err.message); // eslint-disable-line no-console
        nextTask();
      });
  });

  async.parallelLimit(tasks, concurrentConnections, () => {
    log('Done');
    done();
  });
};
