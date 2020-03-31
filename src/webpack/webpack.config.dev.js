const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { getEnvMiddleware } = require('../utils');
const mergeConfigs = require('./mergeConfigs');
const {
  createJavascriptConfig,
  createResolveConfig,
  createCssConfig,
  createStylusConfig,
  createFileConfig,
  createSvgConfig
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
    new webpack.EnvironmentPlugin(env),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      template: paths.public.template
    }),
    new CopyWebpackPlugin([
      {
        from: paths.public.root
      }
    ]),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    port: 9000,
    contentBase: paths.output.path,
    publicPath: paths.output.publicPath,
    hot: true,
    watchContentBase: true,
    watchOptions: {
      ignored: /node_modules/
    },
    historyApiFallback: true,
    before: (app) => {
      app.get('/env.js', {
        ...getEnvMiddleware(),
        ENV: 'development'
      });
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
    })
  ],
  settings,
  env
);
