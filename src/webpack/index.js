const fs = require('fs')
const async = require('async')
const webpack = require('webpack')
const { resolve } = require('path')
const { spawn } = require('child_process')

const { context, config } = require('./defaults')
const { renderConfig, clientConfig } = require('./webpack.config.prd')

const getRoutes = require('./getRoutes');
const getSitemaps = require('./getSitemaps');

const start = () => {
  spawnWebPack('webpack.config.dev', 'webpack-dev-server')
}

const stage = () => {
  spawnWebPack('webpack.config.stg')
}

const build = () => {
  console.log('>>> ENV:', process.env.ENV)
  console.log('>>> API:', config.queryApiUrl)
  console.log('>>> LPD:', config.launchpadUrl)
  console.log('>>> TKN:', config.launchpadToken)
  console.log('>>> PRD:', config.productName)

  async.parallel({
    renderConfig: (cb) => {
      console.log('>>> CFG:', 'renderConfig')
      webpack(renderConfig).run((err, stats) => {
        console.log('>>> RES:', 'renderConfig')
        if (err) {
          return cb(err)
        }
        printStats(stats)
        cb()
      })
    },
    clientConfig: (cb) => {
      getRoutes(config.queryApiUrl, config.productName)
        .then(routes => {
          console.log('>>> CFG:', 'clientConfig')
          webpack(clientConfig(routes)).run((err, stats) => {
            console.log('>>> RES:', 'clientConfig')
            if (err) {
              return cb(err)
            }
            //printStats(stats)
            cb()
          })
        }).catch(cb)
    },
    sitemap: (cb) => {
      if (process.env.ENV === 'development') return cb()
      getSitemaps(config.queryApiUrl, config.productName)
        .then(sitemaps => {
          var sitemapdir = resolve(process.cwd(), 'build')
          if (!fs.existsSync(sitemapdir)) {
            fs.mkdirSync(sitemapdir);
          }
          async.forEach(sitemaps, (sitemap, sCb) => {
            process.nextTick(() => {
              console.log('>>> creating', sitemap.filename, `${Math.round(sitemap.content.length / 100000) / 10}MB`)
              // Save sitemap to disk
              fs.writeFile(`${sitemapdir}/${sitemap.filename}`, sitemap.content, sCb)
            });
          }, cb)
        }).catch(cb)
    }
  }, err => {
    if (err) {
      console.log('>>> ERR:', err)
      return process.exit(1)
    }
    process.exit(0)
  })
}

const printStats = (stats) => {
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }))
  process.stdout.write('\n')
}

const spawnWebPack = (cfgFile, bin = 'webpack') => {
  const cmd = resolve(context, '.bin', bin)
  const cfg = resolve(__dirname, cfgFile)
  spawn(cmd, ['--config', cfg], { stdio: 'inherit' })
}

module.exports = { start, stage, build }
