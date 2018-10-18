require('dotenv').config();

const webpack = require('webpack');
const path = require('path');
const { spawn } = require('child_process');

const {
  context,
  config
} = require('./defaults');
const { renderConfig, clientConfig } = require('./webpack.config.prd');
const { debug } = require('../utils');

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

const spawnWebPack = (cfgFile, bin = 'webpack', args = []) => {
  const cmd = path.resolve(context, '.bin', bin);
  const cfg = path.resolve(__dirname, cfgFile);
  spawn(cmd, ['--config', cfg, ...args], { stdio: 'inherit' });
};

const start = () => {
  spawnWebPack('webpack.config.dev', 'webpack-dev-server', ['--host', '0.0.0.0']);
};

const stage = () => {
  spawnWebPack('webpack.config.stg');
};

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
    compileWebpackConfig(clientConfig),
    compileWebpackConfig(renderConfig)
  ])
    .then(([clientStats, renderStats]) => {
      printStats('Client', clientStats);
      printStats('Render', renderStats);
    })
    .then(() => {
      process.exit();
    })
    .catch((err) => {
      console.error(err); // eslint-disable-line no-console
      process.exit(1);
    });
};

const buildRender = () => {
  const log = debug('build:render');
  log('ENV:', process.env.ENV);
  log('API:', config.queryApiUrl);
  log('PRD:', config.productName);

  return compileWebpackConfig(renderConfig).then(renderStats => {
    printStats('Render', renderStats);
  });
}

module.exports = { start, stage, build, buildRender };
