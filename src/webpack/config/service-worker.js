const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = (options) => {
  const {
    globDirectory,
    swDest,
  } = options;

  const workboxPlugin = new WorkboxPlugin({
    globDirectory,
    swDest,
    globPatterns: ['**/*.{html,js,css}'],
    dontCacheBustUrlsMatching: /\.\w{5}\./,
    clientsClaim: true,
    skipWaiting: true
  });

  return {
    plugins: [workboxPlugin]
  };
};
