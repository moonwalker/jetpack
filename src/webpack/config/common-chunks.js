const webpack = require('webpack');

module.exports = () => ({
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: ({ resource }) => /node_modules/.test(resource)
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: ({ resource }) => /webpack/.test(resource)
    })
  ]
});
