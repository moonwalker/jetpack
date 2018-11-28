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

  log('ENV:', process.env.ENV || process.env.env || process.env.NODE_ENV || 'development');
  log('API:', config.queryApiUrl);
  log('PRD:', config.productName);

  return getRoutes(config)
    .then(run)
    .then(({ err, result }) =>
      writeStats(result).then(displayStats).then(() => {
        if (err) {
          throw err;
        }
      }))
    .catch((err) => {
      console.error(err); // eslint-disable-line no-console
      process.exit(1);
    });
};

module.exports = {
  prerender
};
