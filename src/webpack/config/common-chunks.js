module.exports = () => ({
  optimization: {
    // Extract Webpack runtime
    // https://webpack.js.org/configuration/optimization/#optimization-runtimechunk
    runtimeChunk: {
      name: 'manifest'
    },

    // Hashed module ids
    // https://webpack.js.org/configuration/optimization/#optimization-moduleids
    moduleIds: 'hashed',

    // Code spllitting
    splitChunks: {
      chunks: 'all',

      // Using named chunks is causing cache invalidation when the chunk will
      // be used by another chunk. Keeping names for tracking & debugging.
      // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
      // name: true,
      hidePathInfo: false,

      // Disable automatically chunking for async chunks
      minSize: Infinity,

      cacheGroups: {
        vendor: {
          chunks: 'initial',
          name: 'vendor',
          // manually setting the filename and avoid the webpack generated filename
          filename: 'static/js/vendor.[contenthash].js',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          enforce: true
        }
      }
    }
  }
});
