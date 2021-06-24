module.exports = (options = {}) => {
  const { include = [] } = options;

  const stylusRule = {
    test: /\.styl$/,
    include,
    enforce: 'pre',
    loader: 'stylus-loader',
    options: {
      stylusOptions: {
        paths: include
      }
    }
  };

  return { module: { rules: [stylusRule] } };
};
