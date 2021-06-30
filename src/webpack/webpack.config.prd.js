const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const constants = require('../constants');
const mergeConfigs = require('./mergeConfigs');
const settings = require('./defaults');
const {
  createJavascriptConfig,
  createResolveConfig,
  createFileConfig,
  createCssConfig,
  createStylusConfig,
  createCommonChunks,
  createServiceWorkerConfig,
  createBuildInfo,
  createStatsConfig,
  createSvgConfig,
  createDefineConfig
} = require('./config');

const env = {
  ...constants,
  ENV: 'production',
  NODE_ENV: 'production'
};

const CLIENT_ENV = {
  ...env,
  CLIENT: true
};

const SERVER_ENV = {
  ...env,
  SERVER: true
};

const { context, paths } = settings;

const clientConfig = mergeConfigs(
  [
    {
      bail: true,
      mode: 'production',
      context,
      devtool: 'source-map',
      entry: {
        init: paths.entry.init,
        main: paths.entry.main
      },
      output: {
        path: paths.output.path,
        filename: paths.output.filename,
        chunkFilename: paths.output.chunkFilename,
        publicPath: paths.output.publicPath,
        hashDigestLength: 8
      },
      plugins: [
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
          __CLIENT__: JSON.stringify(true),
          __SERVER__: JSON.stringify(false)
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        // new webpack.HashedModuleIdsPlugin(),
        new CopyWebpackPlugin({
          patterns: [
            {
              from: paths.public.root
            }
          ]
        }),
        new AssetsPlugin({
          ...paths.assets
        })
      ],
      optimization: {
        chunkIds: 'named',
        minimizer: [new TerserPlugin({ parallel: true })]
      }
    },
    createResolveConfig(),
    createJavascriptConfig(
      {
        include: paths.src
      },
      CLIENT_ENV
    ),
    createCssConfig(
      {
        include: paths.src,
        minimize: true,
        extractChunks: true,
        filename: paths.output.cssFilename
      },
      CLIENT_ENV
    ),
    createStylusConfig({
      include: paths.src
    }),
    createFileConfig({ context: paths.src }, CLIENT_ENV),
    createSvgConfig({ context: paths.src }),
    createCommonChunks(),
    createBuildInfo({
      output: paths.output.buildInfo
    }),
    createStatsConfig(),
    createServiceWorkerConfig({
      swDest: paths.output.swDest
    }),
    createDefineConfig({ isClient: true })
  ],
  settings,
  CLIENT_ENV
);

const renderConfig = mergeConfigs(
  [
    {
      bail: true,
      mode: 'production',
      context,
      target: 'node',
      externals: [nodeExternals()],
      entry: {
        render: paths.entry.render
      },
      output: {
        path: paths.render.path,
        filename: paths.render.filename,
        libraryTarget: 'commonjs2',
        publicPath: paths.output.publicPath
      },
      plugins: [
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
          __CLIENT__: JSON.stringify(false),
          __SERVER__: JSON.stringify(true)
        }),
        new webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 1
        })
      ],
      devtool: 'source-map',
      optimization: {
        minimize: false
      }
    },
    createResolveConfig(),
    createJavascriptConfig(
      {
        include: paths.src
      },
      SERVER_ENV
    ),
    createCssConfig(
      {
        include: paths.src,
        node: true
      },
      SERVER_ENV
    ),
    createStylusConfig({
      include: paths.src
    }),
    createFileConfig(
      {
        context: paths.src,
        emitFile: false
      },
      SERVER_ENV
    ),
    createSvgConfig({
      context: paths.src
    }),
    createDefineConfig({ isClient: false })
  ],
  settings,
  SERVER_ENV
);

module.exports = { renderConfig, clientConfig };
module.exports.renderConfig = renderConfig;
