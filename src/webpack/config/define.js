const webpack = require('webpack');

module.exports = (options = {}) => {
  const { isClient = true, isStorybook = false } = options;

  return {
    plugins: [
      new webpack.DefinePlugin({
        'process.env.API_HOST_SSR': JSON.stringify(process.env.API_HOST_SSR),
        'process.browser': JSON.stringify(isClient),
        'process.env.STORYBOOK': JSON.stringify(isStorybook),
        'process.env.SENTRY_CLIENT_DSN': JSON.stringify(process.env.SENTRY_CLIENT_DSN)
      })
    ]
  };
};
