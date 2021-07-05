require('dotenv').config();

const webpack = require('webpack');
const path = require('path');
const { spawn } = require('child_process');

const { ENV } = require('../constants');
const { debug } = require('../utils');
const { context, config } = require('./defaults');
const { renderConfig, clientConfig } = require('./webpack.config.prd');

const printStats = (mode, stats) => {
  process.stdout.write('\n');
  process.stdout.write(mode);
  process.stdout.write('\n');

  process.stdout.write(
    stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    })
  );

  process.stdout.write('\n');
};

const spawnWebPack = (cfgFile, subCommand = 'build', args = []) => {
  const cmd = path.resolve(context, '.bin/webpack');
  const cfg = path.resolve(__dirname, cfgFile);
  spawn(cmd, [subCommand, '--config', cfg, ...args], { stdio: 'inherit' });
};

const start = () => {
  spawnWebPack('webpack.config.dev', 'serve', ['--host', '0.0.0.0']);
};

const stage = () => {
  spawnWebPack('webpack.config.stg');
};

const compileWebpackConfig = (webpackConfig) =>
  new Promise((resolve, reject) =>
    webpack(webpackConfig).run((err, stats) => {
      if (err) {
        reject(err);
      }

      resolve(stats);
    })
  );

const buildClient = () => {
  const log = debug('build:client');
  log('PRD:', config.productName);
  log('ENV:', ENV);
  log('API:', config.queryApiUrl);

  return compileWebpackConfig(clientConfig).then((stats) => printStats('Client', stats));
};

const buildRender = () => {
  const log = debug('build:render');
  log('PRD:', config.productName);
  log('ENV:', ENV);
  log('API:', config.queryApiUrl);

  return compileWebpackConfig(renderConfig).then((renderStats) =>
    printStats('Render', renderStats)
  );
};

const build = () => Promise.all([buildClient(), buildRender()]);

module.exports = {
  start,
  stage,
  build,
  buildClient,
  buildRender
};
