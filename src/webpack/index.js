/* eslint-disable no-console */
const fs = require('fs')
const async = require('async')
const webpack = require('webpack')
const path = require('path')
const { spawn } = require('child_process')

const { context, config, paths, minimize } = require('./defaults')
const { renderConfig, clientConfig } = require('./webpack.config.prd')

const getRoutes = require('./getRoutes');
const getSitemaps = require('./getSitemaps');
const prerender = require('./prerender');

const printStats = (mode, stats) => {
  process.stdout.write('\n');
  process.stdout.write(mode);
  process.stdout.write('\n');

  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }));

  process.stdout.write('\n');
};

const start = () => {
  spawnWebPack('webpack.config.dev', 'webpack-dev-server')
}

const stage = () => {
  spawnWebPack('webpack.config.stg')
}

const compileWebpackConfig = webpackConfig => new Promise((resolve, reject) =>
  webpack(webpackConfig).run((err, stats) => {
    if (err) {
      reject(err);
    }

    resolve(stats);
  }));

const build = () => {
  console.log('>>> ENV:', process.env.ENV)
  console.log('>>> API:', config.queryApiUrl)
  console.log('>>> PRD:', config.productName)

  Promise.all([
    getRoutes(config.queryApiUrl, config.productName),
    compileWebpackConfig(clientConfig),
    compileWebpackConfig(renderConfig)
  ])
    .then(([routes, clientStats, renderStats]) => {
      console.log('Routes', routes.length);
      printStats('Client', clientStats);
      printStats('Render', renderStats);
      return routes.filter(_ => _.path.match(/$\sv$/));
    })
    .then(prerender)
    .catch(err =>
      console.error(err)
    );

    /*
    console.log('>>> CFG:', 'renderConfig')
    webpack(renderConfig).run((err, stats) => {
      if (err) {
        return console.log('>>> ERR:', err)
      }
      printStats(stats)

      console.log('>>> CFG:', 'clientConfig')
      webpack(clientConfig(routes)).run((err, stats) => {
        cb()
      })
    },
    clientConfig: (cb) => {
      getRoutes(config.queryApiUrl, config.productName)
        .then(routes => {
          console.log('>>> CFG:', 'clientConfig')
          webpack(clientConfig(routes)).run(cb)
        }).catch(cb)
    },
    sitemaps: (cb) => {
      getSitemaps(config.queryApiUrl, config.productName)
        .then(sitemaps => {
          cb(null, sitemaps);
        }).catch(cb)
    }
  }, (err, res) => {
    if (err) {
      console.log('>>> ERR:', err)
      return process.exit(1)
    }
    console.log('>>> RES:', 'renderConfig')
    printStats(res.renderConfig);
    console.log('>>> RES:', 'clientConfig')
    //printStats(res.clientConfig);

    if (!res.sitemaps) return process.exit(0);

    var sitemapdir = resolve(process.cwd(), 'build');
    if (!fs.existsSync(sitemapdir)) {
      fs.mkdirSync(sitemapdir);
    }
    async.forEach(res.sitemaps, (sitemap, sCb) => {
      const sitemapPath = `${sitemapdir}/${sitemap.filename}`;
      console.log('>>> creating', sitemapPath, `${(sitemap.content.length / 1048576).toFixed(1)}MB`)
      // Save sitemap to disk
      fs.writeFile(sitemapPath, sitemap.content, sCb)
    }, err => {
      if (err) {
        console.log('>>> ERR:', err)
        return process.exit(1)
      }
      process.exit(0);
    });
  })
  */
}

const spawnWebPack = (cfgFile, bin = 'webpack') => {
  const cmd = path.resolve(context, '.bin', bin)
  const cfg = path.resolve(__dirname, cfgFile)
  spawn(cmd, ['--config', cfg], { stdio: 'inherit' })
}

module.exports = { start, stage, build }
