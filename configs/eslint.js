const path = require('path');

const extendConfigPath = path.join(
  path.dirname(require.resolve('@moonwalker/pre-flight-check')),
  'eslint'
);

module.exports = {
  extends: extendConfigPath,
  globals: {
    __STORYBOOK__: true,
    APP_CONFIG: true
  },
};
