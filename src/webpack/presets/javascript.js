const { merge } = require('lodash');

/**
 * @param {object} options
 * @param {boolean} [options.isDevelopment]
 * @param {object} [options.rule]
 * @param {object} [options.babelLoaderOptions]
 * @returns {object}
 */
module.exports = function createJavascriptConfig(options = {}) {
  const { isDevelopment = false, rule = {}, babelLoaderOptions = {} } = options;

  const defaultBabelOptions = {
    cacheDirectory: isDevelopment
  };

  return {
    module: {
      rules: [
        merge(
          {
            test: /\.(js|ts)x?$/,
            loader: require.resolve('babel-loader'),
            options: merge(defaultBabelOptions, babelLoaderOptions)
          },
          rule
        )
      ]
    },
    ignoreWarnings: [/Failed to parse source map/]
  };
};
