const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = (options) => {
  const {
    globDirectory,
    swDest,
  } = options;

  const workboxPlugin = new WorkboxPlugin({
    globDirectory,
    swDest,
    globPatterns: [
      'static/js/{main,vendor}.*.js'
    ],
    dontCacheBustUrlsMatching: /\.\w{5}\./,
    clientsClaim: true,
    skipWaiting: true
  });

  return {
    plugins: [workboxPlugin]
  };
};
