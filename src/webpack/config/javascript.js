module.exports = (options) => {
  const { include = [], cache = false } = options;
  const test = /\.jsx?$/;

  const babelRule = {
    test,
    include,
    loader: 'babel-loader',
    options: {
      cacheDirectory: cache
    }
  };

  return {
    module: {
      rules: [babelRule]
    },
    ignoreWarnings: [/Failed to parse source map/]
  };
};
