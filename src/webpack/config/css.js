const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (paths) => ({
  module: {
    rules: [
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
    new ExtractTextPlugin({
      filename: paths.output.cssFilenameDev,
      allChunks: true
    })
  ]
})
