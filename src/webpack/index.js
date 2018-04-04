/* eslint-disable no-console */
const fs = require('fs')
const async = require('async')
const webpack = require('webpack')
const path = require('path')
const { spawn } = require('child_process')

const { context, config, paths, minimize } = require('./defaults')
const { renderConfig, clientConfig } = require('./webpack.config.prd')

const getRoutes = require('./getRoutes');
const prerender = require('./prerender');
const sitemap = require('./sitemap');

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
  console.log('>>> ENV:', process.env.ENV)
  console.log('>>> API:', config.queryApiUrl)
  console.log('>>> PRD:', config.productName)

  Promise.all([
    // build
    Promise.all([
      getRoutes(config.queryApiUrl, config.productName),
      compileWebpackConfig(clientConfig),
      compileWebpackConfig(renderConfig)
    ])
      .then(([routes, clientStats, renderStats]) => {
        console.log('Routes', routes.length);
        printStats('Client', clientStats);
        printStats('Render', renderStats);

        return routes;
      })
      .then(prerender),

    // sitemap
    sitemap(config)
  ]).catch(err => console.error(err));
};

const spawnWebPack = (cfgFile, bin = 'webpack') => {
  const cmd = path.resolve(context, '.bin', bin)
  const cfg = path.resolve(__dirname, cfgFile)
  spawn(cmd, ['--config', cfg], { stdio: 'inherit' })
}

module.exports = { start, stage, build }
