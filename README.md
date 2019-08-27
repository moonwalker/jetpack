# Jetpack

[![renovatebot](https://badges.renovateapi.com/github/moonwalker/jetpack)](https://renovatebot.com/dashboard#github/moonwalker/jetpack)

Webpack for Moonwalkers.

## Quick Start

Install:

```shell
$ npm install -g @moonwalker/jetpack
```

Create a new project:

```shell
$ jetpack create projectname
```

Working on the project:

```shell
$ cd projectname
```

Run dev server:

```shell
$ npm start
```

Build for production:

```shell
$ npm run build
```

## Eslint + Prettier config

The idea is to automate the code formatting, while relying on Eslint to report code errors (undefined variables, not found modules, etc.). 

### How is working
[lint-staged](https://www.npmjs.com/package/lint-staged) is running [Prettier](https://www.npmjs.com/package/prettier) and [Eslint](https://www.npmjs.com/package/eslint) before commiting. If there are eslint errors, the commit will stop.

To skip the check entirely, you can use `git commit --no-verify`.

### Setup

```js
// .eslintrc.js
module.exports = {
  extends: './node_modules/@moonwalker/jetpack/src/eslintrc.js',
  // PROJECT CUSTOM OPTIONS
};
```

```js
// prettier.config.js
module.exports = require('./node_modules/@moonwalker/jetpack/src/prettier.config.js');
```

```js
// lint-staged.config.js
module.exports = require('./node_modules/@moonwalker/jetpack/src/lint-staged.config.js');
```
