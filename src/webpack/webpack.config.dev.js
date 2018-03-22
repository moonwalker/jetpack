const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const mergeConfigs = require('./mergeConfigs');
const {
  createEslintConfig,
  createJavascriptConfig,
  createResolveConfig,
  createCssConfig,
  createStylusConfig,
  createLessConfig,
  createFileConfig
} = require('./config');
const settings = require('./defaults');

const env = {
  ENV: 'development',
  NODE_ENV: 'development'
};

const { paths } = settings;

const devConfig = {
  context: paths.src,
  devtool: 'cheap-module-eval-source-mapp',
  entry: {
    main: paths.entry.main,
    webfonts: paths.entry.webfonts,
    segment: paths.entry.analytics,
    messaging: paths.entry.messaging
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
};

module.exports = mergeConfigs([
  devConfig,

  createResolveConfig(),
  createEslintConfig({
    include: paths.src
  }, env),
  createJavascriptConfig({
    include: paths.src,
    cache: true
  }, env),
  createCssConfig({
    include: paths.src,
    lint: true
  }, env),
  createStylusConfig({
    include: paths.src,
    root: paths.root
  }),
  createLessConfig(),
  createFileConfig({
    context: paths.src
  }, env)
], settings, env);
