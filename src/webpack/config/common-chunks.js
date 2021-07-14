module.exports = () => ({
  optimization: {
    // Extract Webpack runtime
    // https://webpack.js.org/configuration/optimization/#optimization-runtimechunk
    runtimeChunk: {
      name: 'manifest'
    },

    // Hashed module ids
    // https://webpack.js.org/configuration/optimization/#optimization-moduleids
    moduleIds: 'deterministic',

    // Code spllitting
    splitChunks: {
      chunks: 'all',

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
