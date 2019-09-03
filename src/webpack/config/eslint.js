module.exports = (options, env) => {
  const { include = [], cache = true } = options;
  const { NODE_ENV } = env;

  const isDevelopment = NODE_ENV === 'development';
  const test = /\.jsx?$/;

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
      rules: [eslintRule]
    }
  };
};
