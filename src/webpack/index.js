/* eslint-disable no-console */
require('dotenv').config();

const webpack = require('webpack')
const path = require('path')
const { spawn } = require('child_process')

const { context, config, paths, minimize } = require('./defaults')
const { renderConfig, clientConfig } = require('./webpack.config.prd')
const debug = require('./debug');
const getRoutes = require('./getRoutes');
const runPrerender = require('./prerender');
const getSitemaps = require('./getSitemaps');
const writeSitemaps = require('./writeSitemaps');
const writePrerenderStats = require('./prerender/writeStats');

const printStats = (mode, stats) => {
  process.stdout.write('\n');
  process.stdout.write(mode);
  process.stdout.write('\n');

  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }));

  process.stdout.write('\n');
};

const start = () => {
  spawnWebPack('webpack.config.dev', 'webpack-dev-server')
}

const stage = () => {
  spawnWebPack('webpack.config.stg')
}

const compileWebpackConfig = webpackConfig => new Promise((resolve, reject) =>
  webpack(webpackConfig).run((err, stats) => {
    if (err) {
      reject(err);
    }

    resolve(stats);
  }));

const build = () => {
  const log = debug('build');
  log('ENV:', process.env.ENV);
  log('API:', config.queryApiUrl);
  log('PRD:', config.productName);

  return Promise.all([
    getSitemaps(config.queryApiUrl, config.productName),
    compileWebpackConfig(clientConfig),
    compileWebpackConfig(renderConfig)
  ])
    .then(([sitemaps, clientStats, renderStats]) => {
      printStats('Client', clientStats);
      printStats('Render', renderStats);

      return sitemaps;
    })
    .then(writeSitemaps)
    .then(() => {
      process.exit();
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
};

const prerender = () => {
  const log = debug('prerender');
  log('ENV:', process.env.ENV);
  log('API:', config.queryApiUrl);
  log('PRD:', config.productName);

  return getRoutes(config.queryApiUrl, config.productName)
    .then(runPrerender)
    .then(writePrerenderStats)
    .then(() => {
      process.exit();
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
};

const spawnWebPack = (cfgFile, bin = 'webpack') => {
  const cmd = path.resolve(context, '.bin', bin)
  const cfg = path.resolve(__dirname, cfgFile)
  spawn(cmd, ['--config', cfg], { stdio: 'inherit' })
}

module.exports = { start, stage, build, prerender }
