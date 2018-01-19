const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const createJavascriptConfig = require('./config/javascript');
const createCssConfig = require('./config/css');
const createResolveConfig = require('./config/resolve');
const { context, paths } = require('./defaults');

const env = {
  ENV: 'development',
  NODE_ENV: 'development'
}

const devConfig = {
  context: context,
  devtool: 'cheap-module-eval-source-mapp',
  entry: {
    main: paths.entry.main,
    webfonts: paths.entry.webfonts
  },
  output: {
    path: paths.output.path,
    filename: paths.output.filenameDev,
    chunkFilename: paths.output.filename,
    publicPath: paths.output.publicPath
  },
  plugins: [
    new CleanWebpackPlugin(paths.output.path, {
      root: paths.root
    }),
    new webpack.EnvironmentPlugin(env),
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: ({ resource }) => {
        return resource && /node_modules/.test(resource);
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: ({ resource }) => {
        return resource && /webpack/.test(resource);
      }
    }),
    new HtmlWebpackPlugin({
      template: paths.public.template
    }),
    new CopyWebpackPlugin([
      { from: paths.public.root }
    ]),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    port: 9000,
    contentBase: paths.public.root,
    publicPath: paths.output.publicPath,
    hot: true,
    compress: true,
    watchContentBase: true,
    watchOptions: {
      ignored: /node_modules/
    },
    historyApiFallback: {
      rewrites: [
        { from: /(.*)/, to: paths.output.publicPath }
      ],
    }
  }
}

module.exports = webpackMerge(
  devConfig,
  createJavascriptConfig(paths)
  createCssConfig(paths),
  createResolveConfig(),
)
