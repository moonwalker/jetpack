const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const {
  createJavascriptConfig,
  createResolveConfig,
  createCssConfig,
  createStylusConfig,
  createLessConfig,
  createServiceWorkerConfig,
} = require('./config');
const { config, paths, banner, minimize } = require('./defaults');

const env = {
  ENV: 'staging',
  NODE_ENV: 'production'
}

const stageConfig = {
  bail: true,
  context: paths.src,
  devtool: 'source-map',
  entry: {
    main: paths.entry.main,
    webfonts: paths.entry.webfonts
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
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: ({
        resource
      }) => {
        return resource && /node_modules/.test(resource);
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: ({
        resource
      }) => {
        return resource && /webpack/.test(resource);
      }
    }),
    new HtmlWebpackPlugin({
      template: paths.public.template
    }),
    new CopyWebpackPlugin([{
      from: paths.public.root,
      ignore: ['index.html']
    }]),
    new UglifyJsPlugin({
      sourceMap: true
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'bundle-analysis.html',
    })
  ]
}

module.exports = webpackMerge(
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
  createStylusConfig(),
  createLessConfig(),
  createServiceWorkerConfig({
    globDirectory: paths.output.path,
    swDest: paths.output.swDest,
  })
);
