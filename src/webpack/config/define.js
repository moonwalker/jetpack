const webpack = require('webpack');

module.exports = (options = {}) => {
  const { isClient = true, isStorybook = false } = options;

  return {
    plugins: [
      new webpack.DefinePlugin({
        __CLIENT__: JSON.stringify(isClient),
        __SERVER__: JSON.stringify(!isClient),
        __STORYBOOK__: JSON.stringify(isStorybook),
        __SENTRY_CLIENT_DSN__: JSON.stringify(process.env.SENTRY_CLIENT_DSN),
        'process.env.PRODUCT_NAME': JSON.stringify(process.env.PRODUCT_NAME)
      })
    ]
  };
};
