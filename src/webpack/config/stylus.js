module.exports = () => ({
  module: {
    rules: [
      {
        test: /\.styl$/,
        enforce: 'pre',
        loader: 'stylus-loader',
        options: {
          sourceMap: true
        }
      }
    ]
  }
})
