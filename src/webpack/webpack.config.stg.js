const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const mergeConfigs = require('./mergeConfigs');
const {
  createJavascriptConfig,
  createResolveConfig,
  createCssConfig,
  createStylusConfig,
  createLessConfig,
  createServiceWorkerConfig,
  createFileConfig,
  createCommonChunks,
  createBuildInfo,
  createStatsConfig
} = require('./config');
const settings = require('./defaults');

const env = {
  CLIENT: true,
  ENV: 'staging',
  NODE_ENV: 'production'
};

const { paths } = settings;

const stageConfig = {
  bail: true,
  context: paths.src,
  devtool: 'source-map',
  entry: {
    main: paths.entry.main,
    webfonts: paths.entry.webfonts,
    segment: paths.entry.analytics,
    messaging: paths.entry.messaging,
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
    new HtmlWebpackPlugin({
      template: paths.public.template
    }),
    new CopyWebpackPlugin([{
      from: paths.public.root
    }]),
    new UglifyJsPlugin({
      sourceMap: true
    })
  ]
};

module.exports = mergeConfigs([
  stageConfig,

  createResolveConfig(),
  createJavascriptConfig({
    include: paths.src
  }, env),
  createCssConfig({
    include: paths.src,
    minimize: true,
    filename: paths.output.cssFilename
  }, env),
  createStylusConfig({
    include: paths.src
  }),
  createLessConfig(),
  createFileConfig({
    context: paths.src
  }, env),
  createCommonChunks(),
  createStatsConfig(),
  createBuildInfo({
    output: paths.output.buildInfo
  }),
  createServiceWorkerConfig({
    globDirectory: paths.output.path,
    swDest: paths.output.swDest,
  })
], settings, env);
