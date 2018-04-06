const { readFileSync } = require('fs')
const { resolve } = require('path')

const name = 'jetpack'

module.exports = {
  run: () => {
    const cmd = process.argv[2]

    if (['-v', '--version'].indexOf(cmd) !== -1) {
      return console.log(version())
    }

    if (cmd === 'start') {
      return require('./start').run()
    }

    if (cmd === 'stage') {
      return require('./stage').run()
    }

    if (cmd === 'build') {
      return require('./build').run()
    }

    if (cmd === 'prerender') {
      return require('./prerender').run()
    }

    if (cmd === 'create') {
      return require('./create').run(process.argv[3], process.argv[4])
    }

    console.log(help())
  }
}

const version = () => {
  const pkgp = resolve(__dirname, '..', '..', 'package.json')
  const pkg = JSON.parse(readFileSync(pkgp))
  return `${name} version ${pkg.version}`
}

const help = () => {
  return `
${name} — Webpack for Moonwalkers

Usage: ${name} <command>

Commands:
  create    create a new project
  start     start development server
  build     build app for production
  prerender generate static files

Options:
  -v, --version   print version information`
}
