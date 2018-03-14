const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');
const stylelint = require('stylelint');
const postcssReporter = require('postcss-reporter');
const ExtractCssChunksPlugin = require('extract-css-chunks-webpack-plugin');
const ExtractCssPlugin = require('extract-text-webpack-plugin');

module.exports = (options, env) => {
  const {
    include = [],
    minimize = false,
    node = false,
    lint = false,
    extractChunks = false,
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

  const transformRules = [
    transformCssRule,
    transformPostCssRule
  ];

  const deliveryExtractChunksRule = {
    test,
    include,
    use: ExtractCssChunksPlugin.extract({
      use: []
    })
  };

  const deliveryExtractRule = {
    test,
    include,
    enforce: 'post',
    use: ExtractCssPlugin.extract({
      use: [],
      fallback: 'style-loader'
    })
  };

  if (node) {
    return {
      module: {
        rules: transformRules
      }
    };
  }

  if (extractChunks) {
    return {
      module: {
        rules: [
          deliveryExtractChunksRule,
          ...transformRules
        ]
      },
      plugins: [
        new ExtractCssChunksPlugin({
          filename
        })
      ]
    };
  }

  return {
    module: {
      rules: [
        deliveryExtractRule,
        ...transformRules
      ]
    },
    plugins: [
      new ExtractCssPlugin({
        filename,
        allChunks: true,
        disable: isDevelopment
      })
    ]
  };
};
