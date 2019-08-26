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

[Prettier](https://www.npmjs.com/package/prettier) is automatically formatting the code on commit based on the existing eslint rules.

To skip the check, you can use `git commit --no-verify`.

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
