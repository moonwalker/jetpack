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

const PARALLEL_LIMIT = 20;

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
    assets
  } = options;

  const log = debug(`jetpack:prerender:${id + 1}/${workersCount}`);

  log(`Start prerendering ${routes.length} routes (pid: ${process.pid})...`);

  const tasks = routes.map(route => nextTask =>
    render({ route, assets })
      .then(writeHtml(route.path))
      .then(nextTask)
      .catch((err) => {
        console.error('Render error', err.message); // eslint-disable-line no-console
        nextTask();
      }));

  async.parallelLimit(tasks, PARALLEL_LIMIT, () => {
    log('Done');
    done();
  });
};
