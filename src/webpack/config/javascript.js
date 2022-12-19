const TEST = /\.(j|t)sx?$/;
const TEST_JS = /\.jsx?$/;

module.exports = (options) => {
  const { include = [], cache = false } = options;

  const sourceMapRule = {
    test: TEST_JS, //
    enforce: 'pre',
    include: () => true, // process source-maps across all folders - works when linked
    loader: 'source-map-loader'
  };

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
      rules: [babelRule, sourceMapRule]
    },
    ignoreWarnings: [/Failed to parse source map/]
  };
};
