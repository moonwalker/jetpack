const path = require('path');

const extendConfigPath = path.join(
  path.dirname(require.resolve('@moonwalker/pre-flight-check')),
  'eslint'
);

module.exports = {
  extends: extendConfigPath,
  globals: {
    __CLIENT__: true,
    __SERVER__: true,
    __STORYBOOK__: true,
    __SENTRY_CLIENT_DSN__: true,
    APP_CONFIG: true
  }
};
