module.exports = (options) => {
  const { include = [], cache = false } = options;
  const test = /\.jsx?$/;

  const sourceMapRule = {
    test,
    enforce: 'pre',
    include: () => true, // process source-maps across all folders - works when linked
    loader: 'source-map-loader'
  };

  const babelRule = {
    test,
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
      rules: [babelRule, sourceMapRule]
    },
    stats,
    devServer: {
      stats
    }
  };
};
