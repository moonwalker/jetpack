module.exports = (options = {}) => {
  const { include = [] } = options;

  const lessRule = {
    test: /\.less$/,
    include,
    enforce: 'pre',
    loader: 'less-loader',
    options: {
      sourceMap: true
    }
  };

  return { module: { rules: [lessRule] } };
};
