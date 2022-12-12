module.exports = (srcDir) => ({
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: srcDir,
        enforce: 'pre',
        loader: 'ts-loader'
      }
    ]
  }
});
