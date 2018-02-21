const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const {
  createJavascriptConfig,
  createResolveConfig,
  createCssConfig,
  createStylusConfig,
  createLessConfig,
} = require('./config');
const { paths } = require('./defaults');

const env = {
  ENV: 'development',
  NODE_ENV: 'development'
}

const devConfig = {
  context: paths.src,
  devtool: 'cheap-module-eval-source-mapp',
  entry: {
    main: paths.entry.main,
    webfonts: paths.entry.webfonts,
    analytics: paths.entry.analytics
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
    new webpack.optimize.ModuleConcatenationPlugin(),
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
  createResolveConfig(),
  createJavascriptConfig({
    include: paths.src
  }, env),
  createCssConfig({
    include: paths.src
  }, env),
  createStylusConfig(),
  createLessConfig(),
)
