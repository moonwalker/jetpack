const webpack = require('webpack')
const { resolve } = require('path')
const { spawn } = require('child_process')

const { context, config } = require('./defaults')
const { renderConfig, clientConfig } = require('./webpack.config.prod')
const getSitemaps = require('./getSitemaps');

const start = () => {
  const cmd = resolve(context, '.bin', 'webpack-dev-server')
  const cfg = resolve(__dirname, 'webpack.config.dev')
  spawn(cmd, ['--config', cfg], { stdio: 'inherit' })
}

const build = () => {
  console.log('>>> ENV:', process.env.ENV)
  console.log('>>> API:', config.queryApiUrl)

  console.log('>>> CFG:', 'renderConfig')
  webpack(renderConfig).run((err, stats) => {
    if (err) {
      return console.log('>>> ERR:', err)
    }
    printStats(stats)

    console.log()
    console.log('>>> CFG:', 'clientConfig')
    webpack(clientConfig).run((err, stats) => {
      if (err) {
        console.log('>>> ERR:', err)
      }
      printStats(stats)

      // Call launchpad to generate sitemaps
      getSitemaps(config.launchpadUrl, config.launchpadToken)
      .then(sitemaps => {
        var sitemapdir = resolve(process.cwd(), 'build', 'sitemap')
        if (!fs.existsSync(sitemapdir)){
          fs.mkdirSync(sitemapdir);
      }
        for (i = 0; i < sitemaps.length; i++) { 
          sitemap = sitemaps[i]
          
          // Save sitemap to disk
          fs.writeFile(sitemapdir + '/' + sitemap.filename, sitemap.content, (err) => {
            if (err) {
              return console.log('>>> ERR:', err)
            }
          })
        }
      })
    })
  })
}

const printStats = stats => {
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }))
}

module.exports = { start, build }
