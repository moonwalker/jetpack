const webpack = require('webpack');

module.exports = () => ({
  plugins: [
    new webpack.DefinePlugin({
      __PRODUCT_NAME__: JSON.stringify(process.env.PRODUCT_NAME)
    })
  ]
});
