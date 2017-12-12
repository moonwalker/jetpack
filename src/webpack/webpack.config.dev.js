const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
  resolve: {
    extensions: ['.js', '.json', '.css', '.less', '.styl']
  },
  module: {
    rules: [{
        test: /\.js$/,
        include: paths.src,
        loader: 'babel-loader'
      },
      {
        test: /\.(css|less|styl)$/,
        include: paths.src,
        use: ExtractTextPlugin.extract({
          use: [{
              loader: 'css-loader',
              options: {
                modules: true,
                sourceMap: true,
                importLoaders: 2
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                plugins: () => {
                  autoprefixer({ browsers: ['last 2 versions'] });
                }
              }
            },
            {
              loader: 'less-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'stylus-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        })
      }
    ]
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
    new ExtractTextPlugin({
      filename: paths.output.cssFilenameDev,
      allChunks: true
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

module.exports = devConfig
