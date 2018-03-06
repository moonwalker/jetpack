const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const RenderWebpackPlugin = require('./renderWebpackPlugin');
const {
  context,
  paths,
  banner,
  minimize
} = require('./defaults');
const {
  createJavascriptConfig,
  createResolveConfig,
  createFileConfig,
  createCssConfig,
  createStylusConfig,
  createLessConfig,
  createServiceWorkerConfig
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
      segment: paths.entry.analytics
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
      new webpack.BannerPlugin(banner),
      new webpack.NamedModulesPlugin(),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: ({
          resource
        }) => resource && /node_modules/.test(resource)
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest',
        minChunks: ({
          resource
        }) => resource && /webpack/.test(resource)
      }),
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
    filename: paths.output.cssFilename
  }, env),
  createStylusConfig(),
  createLessConfig(),
  createFileConfig({ context: paths.src }, env),
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
  createStylusConfig(),
  createLessConfig(),
  createFileConfig({
    context: paths.src,
    emitFile: false
  }, env)
);

module.exports = { renderConfig, clientConfig };
