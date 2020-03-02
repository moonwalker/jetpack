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

  const transformRules = [
    {
      test,
      include,
      loader: 'postcss-loader',
      options: {
        sourceMap: true,
        plugins: [
          ...(lint ? [stylelint()] : []),

          autoprefixer(),

          // Minimize when not in dev mode
          ...(isDevelopment
            ? []
            : [
                cssnano({
                  // Avoid removing the relative (`./`) notation, webpack needs it
                  preset: [
                    'default',
                    {
                      normalizeUrl: false
                    }
                  ]
                })
              ]),

          postcssReporter({
            clearAllMessages: true
          })
        ]
      }
    },
    {
      test,
      include,
      loader: 'css-loader',
      options: {
        sourceMap: true,
        onlyLocals: node,
        modules: {
          context: paths.src,
          localIdentName: isDevelopment ? '[path][name]__[local]' : '[hash:base64:5]'
        }
      }
    }
  ];

  const deliveryExtractRule = {
    test,
    include,
    enforce: 'post',
    use: isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader
  };

  if (node) {
    return {
      module: {
        rules: transformRules
      }
    };
  }

  return {
    module: {
      rules: [deliveryExtractRule, ...transformRules]
    },
    plugins: [new MiniCssExtractPlugin({ filename })]
  };
};
