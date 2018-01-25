module.exports = (options, env) => {
  const { include = [] } = options;
  const { NODE_ENV } = env;

  const isDevelopment = NODE_ENV === 'development';
  const test = /\.jsx?$/;

  return {
    module: {
      rules: [
        {
          test,
          include,
          loader: 'babel-loader'
        },
        {
          test,
          include,
          enforce: 'pre',
          loader: 'eslint-loader',
          options: {
            emitWarning: isDevelopment
          }
        }
      ]
    }
  }
}
