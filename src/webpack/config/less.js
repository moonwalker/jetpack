module.exports = (options = {}) => {
  const { include = [] } = options;

  return {
    module: {
      rules: [
        {
          test: /\.less$/,
          include,
          enforce: 'pre',
          loader: 'css-loader',
          options: {
            sourceMap: true
          }
        }
      ]
    }
  }
}
