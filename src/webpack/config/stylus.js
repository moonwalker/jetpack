module.exports = (options = {}) => {
  const { include = [] } = options;

  const stylusRule = {
    test: /\.styl$/,
    include,
    enforce: 'pre',
    loader: 'stylus-loader',
    options: {
      paths: include
    }
  };

  return { module: { rules: [stylusRule] } };
};
