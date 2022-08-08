const { get } = require('lodash');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const { getEnvMiddleware } = require('../utils');
const constants = require('../constants');
const mergeConfigs = require('./mergeConfigs');
const {
  createJavascriptConfig,
  createResolveConfig,
  createCssConfig,
  createStylusConfig,
  createFileConfig,
  createSvgConfig,
  createDefineConfig
} = require('./config');
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
      overlay: true,
      progress: true
    },
    static: {
      directory: paths.public.root,
      watch: true
    }
  }
};

module.exports = speedMeasurePlugin.wrap(
  mergeConfigs(
    [
      devConfig,

      createResolveConfig(),
      createJavascriptConfig({ include: paths.src, cache: true }),
      createCssConfig(
        {
          include: paths.src,
          lint: true
        },
        env
      ),
      createStylusConfig({
        include: paths.src,
        root: paths.root
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
