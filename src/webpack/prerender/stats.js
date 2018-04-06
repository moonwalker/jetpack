const path = require('path');
const fse = require('fs-extra');
const { meanBy, round, sumBy } = require('lodash');

const { paths } = require('../defaults');
const log = require('../debug')('prerender', 'stats');

const write = (stats) => {
  const outputFilepath = path.join(paths.artifacts.path, paths.artifacts.prerender);

  return fse.outputJSON(
    outputFilepath,
    stats,
    { spaces: 2 }
  ).then(() => {
    log('Prerender stats saved to %s', outputFilepath);
    return stats;
  });
};

const display = (stats) => {
  const workersStats = stats.workers.map(workerStats => ({
    id: workerStats.id,
    duration: workerStats.duration,
    routes: workerStats.routes.length,
    avgPerRoute: workerStats.duration / workerStats.routes.length
  }));

  workersStats.forEach(({
    id,
    duration,
    routes,
    avgPerRoute
  }) => log(
    'Worker %d: duration: %d, routes: %d, avg per route: %d',
    id,
    round(duration),
    routes,
    round(avgPerRoute)
  ));

  const totalRoutes = sumBy(workersStats, 'routes');

  log(
    'TOTAL: duration: %d, routes: %d, avg per route: %d',
    round(stats.duration),
    totalRoutes,
    round(stats.duration / totalRoutes)
  );

  return stats;
};

module.exports = {
  write,
  display
};
