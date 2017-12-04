const path = require('path');
const async = require('async');
const { minify } = require('html-minifier');

module.exports = class {
  constructor(options = {}) {
    const defaults = {
      routes: () => {
        return [{ path: '/' }];
      },
      render: () => '',
      filename: 'index.html',
      minimize: false
    };
    this.options = { ...defaults, ...options };
  }

  apply(compiler) {
    compiler.plugin('emit', (compilation, callback) => {
      this.getRoutes().then(routes => {
        this.renderRoutes(routes, compilation, callback);
      });
    });
  }

  getRender() {
    const render = this.options.render();
    return render.hasOwnProperty('default')
      ? render.default
      : render;
  }

  getRoutes() {
    const routes = this.options.routes;
    return routes.hasOwnProperty('then')
      ? routes
      : new Promise(resolve => {
        resolve(routes())
      })
  }

  renderRoutes(routes, compilation, callback) {
    const render = this.getRender();
    const assets = this.collectAssets(compilation);

    async.eachSeries(routes, (route, cb) => {
      render({ route, assets }).then(html => {
        if (html) {
          const path = `/${route.market.toLowerCase()}/${route.path}`
          this.addToCompilation(compilation, path,
            this.options.minimize
              ? minify(html, this.options.minimize)
              : html
          );
        }
        cb();
      })
    }, callback)
  }

  collectAssets(compilation) {
    const chunks = compilation.chunks;
    const publicPath = compilation.outputOptions.publicPath;

    const fileReducer = (asset, filename) => {
      switch (path.extname(filename)) {
        case '.js':
          asset.js = path.join(publicPath, filename);
          break;
        case '.css':
          asset.css = path.join(publicPath, filename);
          asset.style = compilation.assets[filename].source();
          break;
      }
      return asset;
    }

    const assets = chunks.reduce((assets, chunk) => {
      assets[chunk.name] = chunk.files.reduce(fileReducer, {});
      return assets;
    }, {});

    // assets.byChunks = (chunkNames = []) => {
    //   return initialChunks
    //     .concat(chunkNames)
    //     .map(c => assets[c])
    //     .reduce((prev, curr) => {
    //       return {
    //         js: [...prev.js, ...curr.js],
    //         css: [...prev.css, ...curr.css],
    //         style: [...prev.style, ...curr.style]
    //       }
    //     });
    // }

    return assets;
  }

  addToCompilation(compilation, route, source) {
    const name = path.join(route, this.options.filename);

    compilation.assets[name] = {
      source: function () {
        return source;
      },
      size: function () {
        return source.length;
      }
    };
  }
}
