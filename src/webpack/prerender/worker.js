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
const assets = require(path.join(paths.render.path, 'webpack-assets.json')); // eslint-disable-line

const PARALLEL_LIMIT = 10;

const writeHtml = (routePath) => {
  const outputFilepath = path.join(paths.output.path, routePath, 'index.html');

  return html => fse.outputFile(
    outputFilepath,
    minimize.enabled ? htmlMinifier.minify(html) : html
  );
};

module.exports = (options, done) => {
  const { routes, id } = options;
  const log = debug(`jetpack:prerender:${id}`);

  log(`Start prerendering ${routes.length} routes (pid: ${process.pid})...`);

  const tasks = routes.map(route => nextTask =>
    render({ route, assets })
      .then(writeHtml(route.path))
      .then(nextTask)
      .catch((err) => {
        console.error(err); // eslint-disable-line no-console
        nextTask();
      }));

  async.parallelLimit(tasks, PARALLEL_LIMIT, () => {
    log('Done');
    done();
  });
};
