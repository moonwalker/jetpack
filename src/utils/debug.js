const debug = require('debug');

const PREFIX = 'jetpack';

module.exports = (...tags) => {
  const namespace = [PREFIX, ...tags].join(':');

  return debug(namespace);
};
