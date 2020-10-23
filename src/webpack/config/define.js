const webpack = require('webpack');

module.exports = () => ({
  plugins: [
    new webpack.DefinePlugin({
      __SENTRY_CLIENT_DSN__: JSON.stringify(process.env.SENTRY_CLIENT_DSN),
      'process.env.PRODUCT_NAME': JSON.stringify(process.env.PRODUCT_NAME)
    })
  ]
});
