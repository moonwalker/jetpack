const TEST = /\.(js|ts)x?$/;

module.exports = (options) => {
  const { include = [], cache = false } = options;

  const babelRule = {
    test: TEST,
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
