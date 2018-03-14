module.exports = (options, env) => {
  const {
    include = [],
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

  return {
    module: {
      rules: [
        babelRule
      ]
    }
  };
};
