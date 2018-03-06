module.exports = (options = {}) => {
  const { include = [] } = options;

  return {
    module: {
      rules: [
        {
          test: /\.styl$/,
          include,
          enforce: 'pre',
          loader: 'stylus-loader',
          options: {
            sourceMap: true
          }
        }
      ]
    }
  };
};
