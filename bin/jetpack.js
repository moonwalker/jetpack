#!/usr/bin/env node

const { start, build } = require('../config/webpack.index')

require('yargs')
  .command('serve', 'dev server', start)
  .command('build', 'run build', build)
  .argv
