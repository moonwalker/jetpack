/**
 * Process CSS files
 * 1. postcss-loader
 * 2. css-loader
 */

const { merge } = require('lodash');
const autoprefixer = require('autoprefixer');
const stylelint = require('stylelint');
const cssnano = require('cssnano');
const postcssReporter = require('postcss-reporter');

module.exports = (options = {}) => {
  const {
    isDevelopment = false,
    isNode = false,
    lint = false,

    rule = {},
    cssLoaderOptions = {},
    postcssLoaderOptions = {}
  } = options;

  const defaultCssLoaderOptions = {
    esModule: false,
    modules: {
      mode: 'local',
      exportOnlyLocals: isNode,
      localIdentName: isDevelopment ? '[path]__[name]__[local]' : '[hash]',
      localIdentHashDigestLength: 5
    }
  };

  const defaultPostcssLoaderOptions = {
    postcssOptions: {
      plugins: []
        .concat(lint && stylelint())
        .concat(autoprefixer())
        .concat(
          !isDevelopment &&
            cssnano({
              preset: [
                'default',
                {
                  normalizeUrl: false // Avoid removing the relative (`./`) notation, required for webpack
                }
              ]
            })
        )
        .concat(postcssReporter({ clearAllMessages: true }))
    }
  };

  return {
    module: {
      rules: [
        {
          test: /\.(css|sass|scss|less|styl)$/,
          ...rule,
          use: [
            {
              loader: 'css-loader',
              options: merge(defaultCssLoaderOptions, cssLoaderOptions)
            },
            {
              loader: 'postcss-loader',
              options: merge(defaultPostcssLoaderOptions, postcssLoaderOptions)
            }
          ]
        }
      ]
    }
  };
};
