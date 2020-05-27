const { readFileSync } = require('fs');
const { resolve } = require('path');

const name = 'jetpack';

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
  build               Run build-client and build-render in parallel
  build-client        Build app production bundle
  build-render        Build render bundle
  prerender           Generate static files

Options:
  -v, --version   print version information`;

module.exports = {
  run: () => {
    const cmd = process.argv[2];

    if (['-v', '--version'].indexOf(cmd) !== -1) {
      return console.log(version());
    }

    if (cmd === 'start') {
      return require('./start').run(); // eslint-disable-line global-require
    }

    if (cmd === 'build') {
      return require('./build').run(); // eslint-disable-line global-require
    }

    if (cmd === 'build-client') {
      return require('./build-client').run(); // eslint-disable-line global-require
    }

    if (cmd === 'build-render') {
      return require('./build-render').run(); // eslint-disable-line global-require
    }

    if (cmd === 'prerender') {
      return require('./prerender').run(); // eslint-disable-line global-require
    }

    if (cmd === 'create') {
      return require('./create').run(process.argv[3], process.argv[4]); // eslint-disable-line global-require
    }

    return console.log(help());
  }
};
