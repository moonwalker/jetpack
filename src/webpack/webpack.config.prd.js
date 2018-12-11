const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');

const { getCommitId } = require('../utils');
const mergeConfigs = require('./mergeConfigs');
const settings = require('./defaults');
const {
  createJavascriptConfig,
  createResolveConfig,
  createFileConfig,
  createCssConfig,
  createStylusConfig,
  createLessConfig,
  createCommonChunks,
  createServiceWorkerConfig,
  createBuildInfo,
  createStatsConfig
} = require('./config');

const env = {
  CLIENT: true,
  COMMIT_ID: getCommitId(),
  ENV: 'production',
  NODE_ENV: 'production'
};

const {
  context,
  paths
} = settings;

const clientConfig = mergeConfigs([
  {
    bail: true,
    mode: 'production',
    context,
    devtool: 'source-map',
    entry: {
      main: paths.entry.main,
      webfonts: paths.entry.webfonts,
      support: paths.entry.support
    },
    output: {
      path: paths.output.path,
      filename: paths.output.filename,
      chunkFilename: paths.output.chunkFilename,
      publicPath: paths.output.publicPath
    },
    plugins: [
      new CleanWebpackPlugin(paths.output.path, {
        root: paths.root
      }),
      new webpack.EnvironmentPlugin(env),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.HashedModuleIdsPlugin(),
      /*
      new UglifyJsPlugin({
        sourceMap: true,
        cache: true,
        parallel: true
      }),
      */
      new CopyWebpackPlugin([{
        from: paths.public.root
      }]),
      new AssetsPlugin({
        ...paths.assets
      })
    ]
  },
  createResolveConfig(),
  createJavascriptConfig({
    include: paths.src
  }, env),
  createCssConfig({
    include: paths.src,
    minimize: true,
    extractChunks: true,
    filename: paths.output.cssFilename
  }, env),
  createStylusConfig({
    include: paths.src
  }),
  createLessConfig(),
  createFileConfig({ context: paths.src }, env),
  createCommonChunks(),
  createBuildInfo({
    output: paths.output.buildInfo
  }),
  createStatsConfig(),
  createServiceWorkerConfig({
    globDirectory: paths.output.path,
    swDest: paths.output.swDest,
  })
], settings, env);

const renderConfig = mergeConfigs([
  {
    bail: true,
    mode: 'production',
    context,
    target: 'node',
    entry: {
      render: paths.entry.render,
    },
    output: {
      path: paths.render.path,
      filename: paths.render.filename,
      libraryTarget: 'commonjs2',
      publicPath: paths.output.publicPath
    },
    plugins: [
      new CleanWebpackPlugin(paths.render.path, {
        root: paths.root
      }),
      new webpack.EnvironmentPlugin({
        ...env,
        CLIENT: false
      }),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
      })
    ],
    devtool: false,
    optimization: {
      minimize: false
    }
  },
  createResolveConfig(),
  createJavascriptConfig({
    include: paths.src
  }, env),
  createCssConfig({
    include: paths.src,
    node: true,
  }, env),
  createStylusConfig({
    include: paths.src
  }),
  createLessConfig(),
  createFileConfig({
    context: paths.src,
    emitFile: false
  }, env)
], settings, env);

module.exports = { renderConfig, clientConfig };
module.exports.renderConfig = renderConfig;
