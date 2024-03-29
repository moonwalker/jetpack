const path = require('path');

const extendConfigPath = path.join(
  path.dirname(require.resolve('@moonwalker/pre-flight-check')),
  'eslint'
);

module.exports = {
  extends: extendConfigPath,
  globals: {
    APP_CONFIG: true,
    __CLIENT__: true,
    __SERVER__: true
  }
};
