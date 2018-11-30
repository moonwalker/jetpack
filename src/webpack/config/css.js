const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');
const stylelint = require('stylelint');
const cssnano = require('cssnano');
const postcssReporter = require('postcss-reporter');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (options, env) => {
  const {
    include = [],
    minimize = false,
    node = false,
    lint = false,
    filename = '[name].css',
  } = options;

  const isDevelopment = env.NODE_ENV === 'development';
  const test = /\.(css|less|styl)$/;

  const transformRule = {
    test,
    include,
    use: [
      {
        loader: node ? 'css-loader/locals' : 'css-loader',
        options: {
          minimize,
          modules: true,
          sourceMap: true,
          localIdentName: isDevelopment ?
            '[path][name]__[local]' :
            '[hash:base64:5]'
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
          plugins: [
            ...(lint ? [stylelint()] : []),
            mqpacker(),
            autoprefixer(),
            ...(isDevelopment ? [] : [cssnano({
              // Avoid removing the relative (`./`) notation, webpack needs it
              preset: ['default', {
                normalizeUrl: false
              }]
            })]),
            postcssReporter({
              clearAllMessages: true
            })
          ]
        }
      }
    ]
  };

  const deliveryExtractRule = {
    test,
    include,
    enforce: 'post',
    use: isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader
  };

  if (node) {
    return {
      module: {
        rules: [transformRule]
      }
    };
  }

  return {
    module: {
      rules: [
        deliveryExtractRule,
        transformRule
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({ filename })
    ]
  };
};
