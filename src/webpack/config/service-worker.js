const { GenerateSW } = require('workbox-webpack-plugin');

module.exports = (options) => {
  const { swDest } = options;

  const generateSWPlugin = new GenerateSW({
    importWorkboxFrom: 'local',
    swDest,

    /* Precache all the initial js files (main, vendors, manifest) */
    chunks: ['manifest', 'main', 'vendor'],
    include: [/\.js$/],

    /* Cache any css/js chunks based on navigation */
    runtimeCaching: [
      {
        urlPattern: /static\/js\/views\/.*\.js/,
        handler: 'CacheFirst'
      },
      {
        urlPattern: /static\/css\/.*\.css/,
        handler: 'CacheFirst'
      }
    ],
    cleanupOutdatedCaches: true,
    clientsClaim: true,
    skipWaiting: true
  });

  return {
    plugins: [generateSWPlugin]
  };
};
