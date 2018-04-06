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
const perf = require('../perf');

const writeHtml = htmlFilepath => (html) => {
  const data = minimize.enabled ? htmlMinifier.minify(html) : html;

  return fse.outputFile(htmlFilepath, data)
    .then(() => ({
      contentSize: data.length
    }));
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

  const workerNamespace = `prerender:worker:worker_${id}`;
  const log = debug(workerNamespace);

  perf.start(workerNamespace);

  log(`${id}/${workersCount} (pid: ${process.pid})`);
  log(`Routes: ${routes.length}`);

  // eslint-disable-next-line import/no-dynamic-require, global-require
  const render = require(renderFilepath).default;

  const tasks = routes.map(route => (nextRoute) => {
    const routeNamespace = `${workerNamespace}:route:${route.path}`;
    const logRoute = debug(routeNamespace);

    perf.start(routeNamespace);

    logRoute('Start');

    const url = path.join(route.path, 'index.html');
    const htmlFilepath = path.join(paths.output.path, url);

    return render({ route, assets })
      .then(writeHtml(htmlFilepath))
      .then((res) => {
        logRoute('End');

        nextRoute(null, {
          [route.path]: {
            url,
            contentSize: res.contentSize,
            duration: perf.end(routeNamespace)
          }
        });
      })
      .catch(err => nextRoute(err));
  });

  return async.parallelLimit(tasks, concurrentConnections, (err, stats) => {
    log('Done');

    done(err, {
      id,
      duration: perf.end(workerNamespace),
      routes: stats
    });
  });
};
