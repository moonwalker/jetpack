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
} = require('./config');
const RenderWebpackPlugin = require('./renderWebpackPlugin');
const getRoutes = require('./getRoutes');
const { context, config, paths, banner, minimize } = require('./defaults');

const env = {
  ENV: 'staging',
  NODE_ENV: 'production'
}

const stageConfig = {
  bail: true,
  context: context,
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
    new webpack.NamedModulesPlugin(),
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
    new CopyWebpackPlugin([
      { from: paths.public.root }
    ]),
    new CopyWebpackPlugin([{
      from: paths.public.root,
      ignore: ['index.html']
    }]),
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
  }),
  createCssConfig({
    include: paths.src,
    filename: paths.output.cssFilename
  }, env),
  createStylusConfig(),
  createLessConfig(),
)
