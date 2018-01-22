module.exports = (options) => {
  const { include = [] } = options;

  return {
    module: {
      rules: [
        {
          test: /\.js$/,
          include,
          loader: 'babel-loader'
        }
      ]
    }
  }
}
