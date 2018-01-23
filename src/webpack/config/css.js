const autoprefixer = require('autoprefixer')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = (options, env) => {
  const {
    include = [],
    minimize = false,
    filename
  } = options;

  const isDevelopment = env.NODE_ENV === 'development';
  const test = /\.(css|less|styl)$/

  return {
    module: {
      rules: [
        // Delivery rule (running after post transformations)
        {
          test,
          include,
          enforce: 'post',
          loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [],
          })
        },

        // Post transformation rules
        {
          test,
          include,
          loader: 'css-loader',
          options: {
            minimize,
            modules: true,
            sourceMap: true,
            localIdentName: isDevelopment ?
              '[path][name]__[local]' :
              '[hash:base64:5]'
          }
        },
        {
          test,
          include,
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
        filename,
        allChunks: true,
        disable: !filename
      })
    ]
  }
}
