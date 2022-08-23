/**
 * Deliver CSS assets
 *
 * style-loader or mini-css-extract
 */

const { merge } = require('lodash');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (options = {}) => {
  const {
    isDevelopment = false,

    rule = {},
    miniCssExtractLoaderOptions = {},
    miniCssExtractPluginOptions = {}
  } = options;

  const defaultMiniCssExtractLoaderOptions = {
    esModule: false
  };

  const defaultMiniCssExtractPluginOptions = {
    filename: isDevelopment ? '[name].css' : '[path][name].[contenthash].css'
  };

  return {
    module: {
      rules: [
        {
          test: /\.(css|sass|scss|less|styl)$/,
          enforce: 'post', // run after the processing rule (see css.js)
          ...rule,
          use: [
            isDevelopment
              ? 'style-loader'
              : {
                  loader: MiniCssExtractPlugin.loader,
                  options: merge(defaultMiniCssExtractLoaderOptions, miniCssExtractLoaderOptions)
                }
          ]
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin(
        merge(defaultMiniCssExtractPluginOptions, miniCssExtractPluginOptions)
      )
    ]
  };
};
