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
        {
          test: /\.(js|ts)x?$/,
          loader: 'babel-loader',
          ...rule,
          options: merge(defaultBabelOptions, babelLoaderOptions)
        }
      ]
    },
    ignoreWarnings: [/Failed to parse source map/]
  };
};
