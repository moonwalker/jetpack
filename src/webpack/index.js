const webpack = require('webpack')
const { resolve } = require('path')
const { spawn } = require('child_process')

const { context } = require('./defaults')
const { renderConfig, clientConfig } = require('./webpack.config.prod')

const start = () => {
  const cmd = resolve(context, '.bin', 'webpack-dev-server')
  const cfg = resolve(__dirname, 'webpack.config.dev')
  spawn(cmd, ['--config', cfg], { stdio: 'inherit' })
}

const build = () => {
  webpack(renderConfig).run((err, stats) => {
    if (err) return console.error(err)
    printStats(stats)

    webpack(clientConfig).run((err, stats) => {
      if (err) return console.error(err)
      printStats(stats)
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
