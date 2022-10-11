const webpack = require('webpack');

module.exports = (options = {}) => {
  const { isClient = true, isStorybook = false } = options;

  return {
    plugins: [
      new webpack.DefinePlugin({
        'process.env.ENV': JSON.stringify(process.env.ENV),
        'process.env.API_HOST_SSR': JSON.stringify(process.env.API_HOST_SSR),
        'process.browser': isClient,
        'process.env.STORYBOOK': isStorybook || JSON.stringify(process.env.STORYBOOK),
        'process.env.SENTRY_CLIENT_DSN': JSON.stringify(process.env.SENTRY_CLIENT_DSN)
      })
    ]
  };
};
