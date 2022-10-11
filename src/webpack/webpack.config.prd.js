const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const constants = require('../constants');
const mergeConfigs = require('./mergeConfigs');
const settings = require('./defaults');
const {
  createResolveConfig,
  createFileConfig,
  createCommonChunks,
  createServiceWorkerConfig,
  createBuildInfo,
  createStatsConfig,
  createSvgConfig,
  createDefineConfig
} = require('./config');
const createCssConfig = require('./presets/css');
const createCssClientDeliveryConfig = require('./presets/css-client-delivery');
const createJavascriptConfig = require('./presets/javascript');

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

const productionConfig = {
  bail: true,
  mode: 'production',
  context,
  devtool: 'source-map',
  plugins: [new CleanWebpackPlugin()]
};

const clientConfig = mergeConfigs(
  [
    productionConfig,
    {
      entry: {
        init: paths.entry.init,
        main: paths.entry.main
      },
      target: 'web',
      output: {
        path: paths.output.path,
        filename: paths.output.filename,
        chunkFilename: paths.output.chunkFilename,
        publicPath: paths.output.publicPath,
        hashDigestLength: 8
      },
      plugins: [
        new webpack.DefinePlugin({
          __CLIENT__: JSON.stringify(true),
          __SERVER__: JSON.stringify(false)
        }),
        new CopyWebpackPlugin({
          patterns: [
            {
              from: paths.public.root
            }
          ]
        }),
        new AssetsPlugin({ ...paths.assets })
      ],
      optimization: {
        minimizer: [new TerserPlugin({ parallel: 4 })],
        runtimeChunk: 'single'
      }
    },
    createResolveConfig(),
    createJavascriptConfig({
      rule: {
        include: paths.src
      }
    }),

    // createStylusConfig({ include: paths.src }),
    createCssConfig({
      rule: {
        include: paths.src
      }
    }),
    createCssClientDeliveryConfig({
      rule: {
        include: paths.src
      },
      miniCssExtractPluginOptions: {
        filename: paths.output.cssFilename
      }
    }),

    createFileConfig({ context: paths.src }, CLIENT_ENV),
    createSvgConfig({ context: paths.src }),
    createCommonChunks(),
    createBuildInfo({ output: paths.output.buildInfo }),
    createStatsConfig({ outputDir: paths.output.path, isClient: true }),
    createServiceWorkerConfig({ swDest: paths.output.swDest }),
    createDefineConfig({ isClient: true })
  ],
  settings,
  CLIENT_ENV
);

const renderConfig = mergeConfigs(
  [
    productionConfig,
    {
      externalsPresets: { node: true },
      entry: {
        render: paths.entry.render
      },
      output: {
        path: paths.render.path,
        filename: paths.render.filename,
        libraryTarget: 'commonjs2',
        publicPath: paths.output.publicPath
      },
      target: 'node',
      resolve: {
        mainFields: ['main', 'module']
      },
      plugins: [
        new webpack.DefinePlugin({
          __CLIENT__: JSON.stringify(false),
          __SERVER__: JSON.stringify(true)
        }),
        new webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 1
        })
      ],
      optimization: {
        minimize: false
      },
      performance: {
        hints: false
      }
    },
    createResolveConfig(),
    createJavascriptConfig({
      rule: {
        include: paths.src
      }
    }),
    createCssConfig({
      isNode: true,
      rule: {
        include: paths.src
      }
    }),
    // createStylusConfig({ include: paths.src }),
    createFileConfig({ context: paths.src, emitFile: false }, SERVER_ENV),
    createSvgConfig({ context: paths.src }),
    createStatsConfig({ outputDir: paths.render.path, isClient: false }),
    createDefineConfig({ isClient: false })
  ],
  settings,
  SERVER_ENV
);

module.exports = { renderConfig, clientConfig };
module.exports.renderConfig = renderConfig;
