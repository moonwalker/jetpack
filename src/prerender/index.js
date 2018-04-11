require('dotenv').config();

const { config } = require('../webpack/defaults');
const getRoutes = require('../webpack/getRoutes');
const { debug } = require('../utils');
const run = require('./run');
const {
  write: writeStats,
  display: displayStats,
} = require('./stats');

const prerender = () => {
  const log = debug('prerender');
  log('ENV:', process.env.ENV);
  log('API:', config.queryApiUrl);
  log('PRD:', config.productName);

  return getRoutes(config.queryApiUrl, config.productName)
    .then(run)
    .then(writeStats)
    .then(displayStats)
    .catch((err) => {
      console.error(err); // eslint-disable-line no-console
      process.exit(1);
    });
};

module.exports = {
  prerender
};
