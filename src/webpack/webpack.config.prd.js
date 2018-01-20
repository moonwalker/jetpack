const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const RenderWebpackPlugin = require('./renderWebpackPlugin');
const { context, config, paths, banner, minimize } = require('./defaults');

const env = {
  ENV: 'production',
  NODE_ENV: 'production'
}

const clientConfig = (routes) => ({
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
        use: ExtractCssChunks.extract({
          use: [{
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 2
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => {
                  autoprefixer({
                    browsers: ['last 2 versions']
                  });
                }
              }
            },
            {
              loader: 'less-loader'
            },
            {
              loader: 'stylus-loader'
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
    new UglifyJsPlugin({
      sourceMap: true
    }),
    new ExtractCssChunks({
      filename: paths.output.cssFilename
    }),
    new RenderWebpackPlugin({
      routes: routes,
      render: () => require(paths.render.file),
      minimize: minimize.enabled ? minimize.minifyOptions : false
    }),
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
    }])
  ]
})

const renderConfig = {
  bail: true,
  context: context,
  target: 'node',
  entry: {
    render: paths.entry.render,
  },
  output: {
    path: paths.render.path,
    filename: paths.render.filename,
    libraryTarget: 'commonjs2'
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
        test: /\.(css|less)$/,
        include: paths.src,
        use: [{
            loader: 'css-loader/locals',
            options: {
              modules: true
            }
          },
          {
            loader: 'less-loader'
          }
        ]
      }
    ]
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
}

module.exports = { renderConfig, clientConfig }
