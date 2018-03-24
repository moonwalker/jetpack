const path = require('path');
const async = require('async');
const { minify } = require('html-minifier');
const debug = require('debug')('jetpack:render');

const RENDER_PARALLEL_LIMIT = 10;

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
    return render.hasOwnProperty('default') ?
      render.default :
      render;
  }

  getRoutes() {
    const routes = this.options.routes;
    return routes.hasOwnProperty('then') ?
      routes :
      new Promise(resolve => {
        resolve(typeof routes === 'function' ? routes() : routes)
      })
  }

  renderRoutes(routes, compilation, callback) {
    const render = this.getRender();
    const assets = this.collectAssets(compilation);

    debug(`Start rendering ${routes.length} routes ...`);

    const tasks = routes.map(route => nextTask => {
      // process.stdout.write(`>>> render: ${route.path}\r`)
      process.nextTick(() => {
        render({ route, assets }).then((html) => {
          if (html) {
            const assetPath = `/${route.path}`;

            this.addToCompilation(
              compilation,
              assetPath,
              this.options.minimize ?
              minify(html, this.options.minimize) :
              html
            );
          }
          // process.stdout.clearLine()
          nextTask();
        }).catch(err => {
          console.log(`>>> ERR ${route.path}: ${err}`);
        })
      })
    });

    async.parallelLimit(tasks, RENDER_PARALLEL_LIMIT, () => {
      debug('End');
      callback();
    });
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
      source: function() {
        return source;
      },
      size: function() {
        return source.length;
      }
    };
  }
}
