const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');
const stylelint = require('stylelint');
const postcssReporter = require('postcss-reporter');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');

module.exports = (options, env) => {
  const {
    include = [],
    minimize = false,
    node = false,
    lint = false,
    filename,
  } = options;

  const isDevelopment = env.NODE_ENV === 'development';
  const test = /\.(css|less|styl)$/;

  const transformCssRule = {
    test,
    include,
    loader: node ? 'css-loader/locals' : 'css-loader',
    options: {
      minimize,
      modules: true,
      sourceMap: true,
      localIdentName: isDevelopment ?
        '[path][name]__[local]' :
        '[hash:base64:5]'
    }
  };

  const transformPostCssRule = {
    test,
    include,
    loader: 'postcss-loader',
    options: {
      sourceMap: true,
      plugins: [
        ...(lint ? [stylelint()] : []),
        mqpacker(),
        autoprefixer(),
        postcssReporter({
          clearAllMessages: true
        })
      ]
    }
  };

  const deliveryExtractRule = {
    test,
    include,
    use: ExtractCssChunks.extract({
      use: []
    })
  };

  const deliveryInjectRule = {
    test,
    include,
    enforce: 'post',
    loader: 'style-loader'
  };

  if (isDevelopment) {
    return {
      module: {
        rules: [
          deliveryInjectRule,
          transformCssRule,
          transformPostCssRule
        ]
      }
    };
  }

  if (node) {
    return {
      module: {
        rules: [
          transformCssRule,
          transformPostCssRule
        ]
      }
    };
  }

  return {
    module: {
      rules: [
        deliveryExtractRule,
        transformCssRule,
        transformPostCssRule
      ]
    },
    plugins: [
      new ExtractCssChunks({
        filename
      })
    ]
  };
};
