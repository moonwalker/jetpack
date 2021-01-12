const webpack = require('webpack');
const { get } = require('lodash');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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

const env = {
  CLIENT: true,
  ENV: 'development',
  NODE_ENV: 'development'
};

const { paths } = settings;

const devConfig = {
  mode: 'development',
  context: paths.src,
  devtool: 'cheap-module-eval-source-mapp',
  entry: {
    init: paths.entry.init,
    main: paths.entry.main
  },
  output: {
    path: paths.output.path,
    filename: paths.output.filenameDev,
    chunkFilename: paths.output.filenameDev,
    publicPath: paths.output.publicPath
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
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
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    port: constants.DEV_PORT,
    contentBase: paths.output.path,
    publicPath: paths.output.publicPath,
    hot: true,
    watchContentBase: true,
    disableHostCheck: true,
    watchOptions: {
      ignored: /node_modules/
    },
    historyApiFallback: true,
    before: (app) => {
      app.get('/env.js', getEnvMiddleware());
    },
    stats: {
      assets: false,
      chunks: false,
      entrypoints: false,
      children: false,
      modules: false
    }
  },
  optimization: {
    splitChunks: false
  }
};

module.exports = mergeConfigs(
  [
    devConfig,

    createResolveConfig(),
    createJavascriptConfig(
      {
        include: paths.src,
        cache: true
      },
      env
    ),
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
);
