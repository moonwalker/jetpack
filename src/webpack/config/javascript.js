const TEST = /\.(js|mjs|ts)x?$/;

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

  const stats = {
    warningsFilter: [/Failed to parse source map/]
  };

  return {
    module: {
      rules: [babelRule]
    },
    stats,
    devServer: {
      stats
    }
  };
};
