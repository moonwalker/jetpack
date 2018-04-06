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

const writeHtml = htmlFilepath => html =>
  fse.outputFile(htmlFilepath, minimize.enabled ? htmlMinifier.minify(html) : html);

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

    const url = path.join(route.path, 'index.html');
    const htmlFilepath = path.join(paths.output.path, url);

    return render({ route, assets })
      .then(writeHtml(htmlFilepath))
      .then(() => {
        logRoute('End');
        nextTask(null, {
          [route.path]: url
        });
      })
      .catch((err) => {
        console.error('Render error', err.message); // eslint-disable-line no-console
        nextTask(err);
      });
  });

  return async.parallelLimit(tasks, concurrentConnections, (err, stats) => {
    log('Done');
    done(err, stats);
  });
};
