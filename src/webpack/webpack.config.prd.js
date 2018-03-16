const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const RenderWebpackPlugin = require('./renderWebpackPlugin');
const {
  context,
  paths,
  minimize
} = require('./defaults');
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
  ENV: 'production',
  NODE_ENV: 'production'
};

const clientConfig = routes => webpackMerge(
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
      new RenderWebpackPlugin({
        routes,
        render: () => require(paths.render.file), // eslint-disable-line
        minimize: minimize.enabled ? minimize.minifyOptions : false
      }),
      new CopyWebpackPlugin([{
        from: paths.public.root,
        ignore: ['index.html']
      }])
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
);

const renderConfig = webpackMerge(
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
      new webpack.EnvironmentPlugin(env),
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
);

module.exports = { renderConfig, clientConfig };
