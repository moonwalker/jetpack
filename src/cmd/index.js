const { readFileSync } = require('fs');
const { resolve } = require('path');

const name = 'jetpack';

module.exports = {
  run: () => {
    const cmd = process.argv[2];

    if (['-v', '--version'].indexOf(cmd) !== -1) {
      return console.log(version());
    }

    if (cmd === 'start') {
      return require('./start').run();
    }

    if (cmd === 'stage') {
      return require('./stage').run();
    }

    if (cmd === 'build') {
      return require('./build').run();
    }

    if (cmd === 'build-render') {
      return require('./build-render').run();
    }

    if (cmd === 'prerender') {
      return require('./prerender').run();
    }

    if (cmd === 'prerender-server') {
      return require('./prerender-server').run();
    }

    if (cmd === 'create') {
      return require('./create').run(process.argv[3], process.argv[4]);
    }

    console.log(help());
  }
};

const version = () => {
  const pkgp = resolve(__dirname, '..', '..', 'package.json');
  const pkg = JSON.parse(readFileSync(pkgp));
  return `${name} version ${pkg.version}`;
};

const help = () => `
${name} — Webpack for Moonwalkers

Usage: ${name} <command>

Commands:
  create              Create a new project
  start               Start development server
  build               Build app for production
  build-render        Build render bundle
  prerender           Generate static files
  prerender-server    Start static file generator service

Options:
  -v, --version   print version information`;
