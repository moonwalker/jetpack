const path = require('path');
const { execSync } = require('child_process');

const rev = process.env.COMMIT || execSync('git rev-parse --short HEAD').toString().trim();
const pwd = (...p) => path.resolve(process.cwd(), ...p);
const lsp = (...p) => path.resolve(process.cwd(), 'node_modules', '@moonwalker', 'lifesupport', 'lib', ...p);

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
      webfonts: lsp('scripts', 'webfonts.js'),
      support: lsp('scripts', 'support.js')
    },
    output: {
      path: pwd('build'),
      filename: 'static/js/[name].[chunkhash:5].js',
      chunkFilename: 'static/js/[name].[chunkhash:5].js',
      filenameDev: 'static/js/[name].js',
      cssFilename: 'static/css/[name].[contenthash:5].css',
      publicPath: '/',
      swDest: pwd('build', 'sw.js'),
      buildInfo: '_build-info.json'
    },
    public: {
      root: pwd('public'),
      template: pwd('src', 'template.html')
    },
    render: {
      path: pwd('node_modules', '.build'),
      file: pwd('node_modules', '.build', 'render.js')
    },
    assets: {
      path: pwd('build'),
      filename: '.webpack-assets.json'
    },
    artifacts: {
      path: pwd('artifacts'),
      prerender: 'prerender.json'
    }
  },
  minimize: {
    enabled: !!process.env.ENV,
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
};
