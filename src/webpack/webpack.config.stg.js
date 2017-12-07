const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const RenderWebpackPlugin = require('./renderWebpackPlugin');
const getRoutes = require('./getRoutes');
const { context, config, paths, banner, minimize } = require('./defaults');

const env = {
  ENV: 'staging',
  NODE_ENV: 'production'
}

module.exports = {
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
                  autoprefixer({
                    browsers: ['last 2 versions']
                  });
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
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true
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
    new WorkboxPlugin({
      globDirectory: paths.output.path,
      globPatterns: ['**/*.{html,js,css}'],
      swDest: paths.output.swDest,
      dontCacheBustUrlsMatching: /\.\w{5}\./,
      clientsClaim: true,
      skipWaiting: true
    }),
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
