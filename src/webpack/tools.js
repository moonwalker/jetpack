const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

module.exports.speedMeasurePlugin = new SpeedMeasurePlugin({
  disable: !process.env.WEBPACK_SPEED_MEASURE
});
