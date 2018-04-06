const path = require('path');
const async = require('async');
const fse = require('fs-extra');
const htmlMinifier = require('html-minifier');
const debug = require('debug');

const {
  paths,
  minimize
} = require('../defaults');

const render = require(paths.render.file).default; // eslint-disable-line

const writeHtml = (routePath) => {
  const outputFilepath = path.join(paths.output.path, routePath, 'index.html');

  return html => fse.outputFile(
    outputFilepath,
    minimize.enabled ? htmlMinifier.minify(html) : html
  );
};

module.exports = (options, done) => {
  const {
    routes,
    id,
    workersCount,
    concurrentConnections,
    assets
  } = options;

  const log = debug(`jetpack:prerender:${id + 1}/${workersCount}`);
  const logRoute = debug('jetpack:prerender:route');

  log(`Start prerendering ${routes.length} routes - ${concurrentConnections} concurrent connections (pid: ${process.pid})...`);

  const tasks = routes.map(route => (nextTask) => {
    logRoute(route.path);

    return render({ route, assets })
      .then(writeHtml(route.path))
      .then(nextTask)
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
