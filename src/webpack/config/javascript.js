module.exports = (options, env) => {
  const {
    include = [],
    lint = false,
    cache = false,
  } = options;
  const { NODE_ENV } = env;

  const isDevelopment = NODE_ENV === 'development';
  const test = /\.jsx?$/;

  const babelRule = {
    test,
    include,
    loader: 'babel-loader',
    options: {
      cacheDirectory: cache
    }
  };

  const eslintRule = {
    test,
    include,
    enforce: 'pre',
    loader: 'eslint-loader',
    options: {
      cache,
      emitWarning: isDevelopment
    }
  };

  return {
    module: {
      rules: [
        babelRule,
        ...(lint ? [eslintRule] : [])
      ]
    }
  };
};
