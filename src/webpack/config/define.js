const webpack = require('webpack');

module.exports = () => ({
  plugins: [
    new webpack.DefinePlugin({
      __PRODUCT_NAME__: JSON.stringify(process.env.PRODUCT_NAME),
      __SENTRY_CLIENT_DSN__: JSON.stringify(process.env.SENTRY_CLIENT_DSN)
    })
  ]
});
