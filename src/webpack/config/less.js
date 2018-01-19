module.exports = () => ({
  module: {
    rules: [
      {
        test: /\.less$/,
        enforce: 'pre',
        loader: 'css-loader',
        options: {
          sourceMap: true
        }
      }
    ]
  }
})
