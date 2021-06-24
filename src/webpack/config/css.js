const autoprefixer = require('autoprefixer');
const stylelint = require('stylelint');
const cssnano = require('cssnano');
const postcssReporter = require('postcss-reporter');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { paths } = require('../defaults');

module.exports = (options, env) => {
  const { include = [], node = false, lint = false, filename = '[name].css' } = options;

  const isDevelopment = env.NODE_ENV === 'development';
  const test = /\.(css|styl)$/;

  const transformRule = {
    test,
    include,
    use: [
      {
        loader: 'css-loader',
        options: {
          modules: {
            exportOnlyLocals: node,
            localIdentContext: paths.src,
            localIdentName: isDevelopment ? '[path][name]__[local]' : '[hash:base64:5]'
          }
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            plugins: [
              ...(lint ? [stylelint()] : []),
              autoprefixer(),
              ...(isDevelopment
                ? []
                : [
                    // Avoid removing the relative (`./`) notation, webpack needs it
                    cssnano({ preset: ['default', { normalizeUrl: false }] })
                  ]),
              postcssReporter({
                clearAllMessages: true
              })
            ]
          }
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
      rules: [deliveryExtractRule, transformRule]
    },
    plugins: [new MiniCssExtractPlugin({ filename })]
  };
};
