const autoprefixer = require('autoprefixer')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const TEST = /\.(css|less|styl)$/

module.exports = (paths) => ({
  module: {
    rules: [
      // Delivery rule
      {
        test: TEST,
        enforce: 'post',
        include: paths.src,
        loader: ExtractTextPlugin.extract({
          use: []
        })
      },

      // Post transformation rules
      {
        test: TEST,
        loader: 'css-loader',
        options: {
          modules: true,
          sourceMap: true,
          importLoaders: 2
        }
      },
      {
        test: TEST,
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
          plugins: () => {
            autoprefixer({ browsers: ['last 2 versions'] });
          }
        }
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: paths.output.cssFilenameDev,
      allChunks: true
    })
  ]
})
