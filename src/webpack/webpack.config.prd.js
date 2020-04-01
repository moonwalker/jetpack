const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

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
  createSvgConfig
} = require('./config');

const env = {
  CLIENT: true,
  ENV: 'production',
  NODE_ENV: 'production'
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
        new webpack.EnvironmentPlugin(env),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.HashedModuleIdsPlugin(),
        new CopyWebpackPlugin([
          {
            from: paths.public.root
          }
        ]),
        new AssetsPlugin({
          ...paths.assets
        })
      ],
      optimization: {
        chunkIds: 'named',
        minimizer: [
          new TerserPlugin({
            parallel: true,
            sourceMap: true
          })
        ]
      }
    },
    createResolveConfig(),
    createJavascriptConfig(
      {
        include: paths.src
      },
      env
    ),
    createCssConfig(
      {
        include: paths.src,
        minimize: true,
        extractChunks: true,
        filename: paths.output.cssFilename
      },
      env
    ),
    createStylusConfig({
      include: paths.src
    }),
    createFileConfig({ context: paths.src }, env),
    createSvgConfig({ context: paths.src }),
    createCommonChunks(),
    createBuildInfo({
      output: paths.output.buildInfo
    }),
    createStatsConfig(),
    createServiceWorkerConfig({
      swDest: paths.output.swDest
    })
  ],
  settings,
  env
);

const renderConfig = mergeConfigs(
  [
    {
      bail: true,
      mode: 'production',
      context,
      target: 'node',
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
    createJavascriptConfig(
      {
        include: paths.src
      },
      env
    ),
    createCssConfig(
      {
        include: paths.src,
        node: true
      },
      env
    ),
    createStylusConfig({
      include: paths.src
    }),
    createFileConfig(
      {
        context: paths.src,
        emitFile: false
      },
      env
    ),
    createSvgConfig({
      context: paths.src
    })
  ],
  settings,
  env
);

module.exports = { renderConfig, clientConfig };
module.exports.renderConfig = renderConfig;
