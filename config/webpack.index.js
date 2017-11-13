const webpack = require('webpack')
const { resolve } = require('path')
const { spawn } = require('child_process')

const { renderConfig, clientConfig } = require('./webpack.config.prod')

module.exports = {
  start: (argv) => {
    const cmd = resolve(__dirname, '..', 'node_modules', '.bin', 'webpack-dev-server')
    const cfg = resolve(process.cwd(), 'node_modules/@moonwalker/jetpack/config/webpack.config.dev')
    spawn(cmd, ['--config', cfg], { stdio: 'inherit' })
  },
  build: (argv) => {
    webpack(renderConfig).run((err, stats) => {
      if (err) return console.error(err)
      printStats(stats)

      webpack(clientConfig).run((err, stats) => {
        if (err) return console.error(err)
        printStats(stats)
      })
    })
  }
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
