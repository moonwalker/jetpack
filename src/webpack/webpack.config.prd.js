const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');

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
  createBuildInfo
} = require('./config');

const env = {
  CLIENT: true,
  ENV: 'production',
  NODE_ENV: 'production'
};

const {
  context,
  paths,
  minimize
} = settings;

const clientConfig = mergeConfigs([
  {
    bail: true,
    context,
    devtool: 'source-map',
    entry: {
      main: paths.entry.main,
      webfonts: paths.entry.webfonts,
      segment: paths.entry.analytics,
      messaging: paths.entry.messaging
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
      new UglifyJsPlugin({
        sourceMap: true,
        cache: true,
        parallel: true
      }),
      new CopyWebpackPlugin([{
        from: paths.public.root,
        ignore: ['index.html']
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
  createServiceWorkerConfig({
    globDirectory: paths.output.path,
    swDest: paths.output.swDest,
  })
], settings, env);

const renderConfig = mergeConfigs([
  {
    bail: true,
    context,
    target: 'node',
    entry: {
      render: paths.entry.render,
    },
    output: {
      path: paths.render.path,
      filename: paths.render.filename,
      libraryTarget: 'commonjs2'
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
    ]
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
