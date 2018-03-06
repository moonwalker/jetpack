const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');
const stylelint = require('stylelint');
const postcssReporter = require('postcss-reporter');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (options, env) => {
  const {
    include = [],
    minimize = false,
    node = false,
    filename,
  } = options;

  const isDevelopment = env.NODE_ENV === 'development';
  const test = /\.(css|less|styl)$/;

  const deliveryRule = {
    test,
    include,
    enforce: 'post',
    loader: ExtractTextPlugin.extract({
      fallback: node ? '' : 'style-loader',
      use: [],
    })
  };

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

  const transfromPostCssRule = {
    test,
    include,
    loader: 'postcss-loader',
    options: {
      sourceMap: true,
      plugins: [
        stylelint(),
        mqpacker(),
        autoprefixer(),
        postcssReporter({
          clearAllMessages: true
        })
      ]
    }
  };

  return {
    module: {
      rules: [
        deliveryRule,
        transformCssRule,
        transfromPostCssRule,
      ]
    },
    plugins: [
      new ExtractTextPlugin({
        filename,
        allChunks: true,
        disable: !filename
      })
    ]
  };
};
