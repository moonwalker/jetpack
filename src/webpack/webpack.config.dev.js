const { get } = require('lodash');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const { getEnvMiddleware } = require('../utils');
const constants = require('../constants');
const mergeConfigs = require('./mergeConfigs');
const {
  createResolveConfig,
  createFileConfig,
  createSvgConfig,
  createDefineConfig
} = require('./config');
const createCssConfig = require('./presets/css');
const createCssDeliveryConfig = require('./presets/css-client-delivery');
const createJavascriptConfig = require('./presets/javascript');
const settings = require('./defaults');
const { speedMeasurePlugin } = require('./tools');

const env = {
  CLIENT: true,
  ENV: 'development',
  NODE_ENV: 'development'
};

const { paths } = settings;

const devConfig = {
  mode: 'development',
  context: paths.src,
  entry: {
    init: paths.entry.init,
    main: paths.entry.main
  },
  target: 'web',
  devtool: 'cheap-module-source-map',
  output: {
    path: paths.output.path,
    filename: paths.output.filenameDev,
    chunkFilename: paths.output.filenameDev,
    publicPath: paths.output.publicPath
  },
  plugins: [
    new ReactRefreshWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: paths.public.template,
      head: get(settings, 'config.additional.global.head')
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: paths.public.root
        }
      ]
    })
  ],
  devServer: {
    port: constants.DEV_PORT,
    hot: true,
    historyApiFallback: true,
    allowedHosts: 'all',
    setupMiddlewares: (middlewares, devServer) => {
      devServer.app.get('/env.js', getEnvMiddleware());
      return middlewares;
    },
    client: {
      logging: 'info',
      progress: false,
      overlay: {
        errors: true,
        warnings: false
      }
    },
    static: {
      directory: paths.public.root,
      watch: true
    }
  },
  optimization: {
    runtimeChunk: 'single'
  }
};

module.exports = speedMeasurePlugin.wrap(
  mergeConfigs(
    [
      devConfig,

      createResolveConfig(),
      createJavascriptConfig({
        isDevelopment: true,
        rule: {
          include: paths.src
        }
      }),

      // createStylusConfig({
      //   include: paths.src,
      //   root: paths.root
      // }),
      createCssConfig({
        isDevelopment: true,
        lint: true,
        rule: {
          include: paths.src
        }
      }),
      createCssDeliveryConfig({
        isDevelopment: true
      }),

      createFileConfig(
        {
          context: paths.src
        },
        env
      ),
      createSvgConfig({
        context: paths.src
      }),
      createDefineConfig({ isClient: true })
    ],
    settings,
    env
  )
);
