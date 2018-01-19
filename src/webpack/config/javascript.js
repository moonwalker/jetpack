module.exports = (paths) => ({
  module: {
    rules: [
      {
        test: /\.js$/,
        include: paths.src,
        loader: 'babel-loader'
      }
    ]
  }
})
