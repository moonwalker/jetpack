const path = require('path');
const { execSync } = require('child_process');

const rev = execSync('git rev-parse --short HEAD').toString().trim();
const pwd = (...p) => path.resolve(process.cwd(), ...p);

module.exports = {
  banner: `[filebase] @ ${rev}`,
  config: require(pwd('src/config')),
  context: path.resolve(__dirname, '..', '..', 'node_modules'),
  paths: {
    root: pwd(),
    src: pwd('src'),
    entry: {
      main: pwd('src', 'client.js'),
      render: pwd('src', 'render.js'),
      webfonts: pwd('src', 'scripts', 'webfonts.js'),
      analytics: pwd('src', 'scripts', 'analytics.js')
    },
    output: {
      path: pwd('build'),
      filename: 'static/js/[name].[chunkhash:5].js',
      chunkFilename: 'static/js/[name].[chunkhash:5].js',
      filenameDev: 'static/js/[name].js',
      cssFilename: 'static/css/[name].[contenthash:5].css',
      publicPath: '/',
      swDest: pwd('build', 'sw.js')
    },
    public: {
      root: pwd('public'),
      template: pwd('public', 'index.html')
    },
    render: {
      path: pwd('node_modules', '.build'),
      file: pwd('node_modules', '.build', 'render.js')
    }
  },
  minimize: {
    enabled: process.env.ENV ? true : false,
    minifyOptions: {
      removeComments: true,
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      keepClosingSlash: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true
    }
  }
}
