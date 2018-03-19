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
            postcssReporter({
              clearAllMessages: true
            })
          ]
        }
      }
    ]
  };

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
        rules: [transformRule]
      }
    };
  }

  if (extractChunks) {
    return {
      module: {
        rules: [
          deliveryExtractChunksRule,
          transformRule
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
        transformRule
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
