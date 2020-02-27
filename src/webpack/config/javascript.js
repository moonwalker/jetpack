const findCacheDir = require('find-cache-dir');

module.exports = (options) => {
  const { include = [], cache = false } = options;
  const test = /\.jsx?$/;

  const babelRule = {
    test,
    include,
    use: [
      {
        loader: 'babel-loader',
        options: {
          cacheDirectory: cache
        }
      },
      {
        loader: 'linaria/loader',
        options: {
          sourceMap: true,
          cacheDirectory: findCacheDir({ name: 'linaria' })
        }
      }
    ]
  };

  return {
    module: {
      rules: [babelRule]
    }
  };
};
