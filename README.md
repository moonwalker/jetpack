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

### Eslint + Prettier config

The idea is to automate the code formatting, while relying on Eslint to report code errors (undefined variables, not found modules, etc.). 

[Read more about code formatting and linting](https://github.com/moonwalker/mrm-presets#pre-flight-check)

#### Setup

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

## Development

```shell
yarn
```

### Publishing


```shell
yarn bump
```

[Read more about the release flow](https://github.com/moonwalker/mrm-presets#how-is-working)
