const { resolve } = require('path');
const merge = require('webpack-merge');

const PROJECT_CONFIG_DIR = 'jetpack';

const resolveProjectConfig = (root, filename) => {
  try {
    const projectConfigPath = resolve(root, PROJECT_CONFIG_DIR, filename);
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require(projectConfigPath);
  } catch (err) {
    return null;
  }
};

module.exports = (webpackConfigs, settings, env) => {
  const webpackConfig = merge(webpackConfigs);
  const projectConfig = resolveProjectConfig(settings.paths.root, 'webpack.config.js');

  // Full-control mode
  if (typeof projectConfig === 'function') {
    return projectConfig(webpackConfig, settings, env);
  }

  // Config mode
  if (typeof projectConfig === 'object') {
    merge.smart(webpackConfig, projectConfig);
  }

  return webpackConfig;
};
