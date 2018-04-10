const path = require('path');
const fse = require('fs-extra');
const { round, sumBy } = require('lodash');

const { paths } = require('../webpack/defaults');
const log = require('../webpack/debug')('prerender', 'stats');

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
    fetchCount: workerStats.fetchCount,
    duration: workerStats.duration,
    routes: workerStats.routes.length,
    avgPerRoute: workerStats.duration / workerStats.routes.length
  }));

  workersStats.forEach(({
    id,
    fetchCount,
    duration,
    routes,
    avgPerRoute
  }) => log(
    'Worker %d: duration: %d, routes: %d, fetch count: %d, avg per route: %d',
    id,
    round(duration),
    routes,
    fetchCount,
    round(avgPerRoute)
  ));

  const totalRoutes = sumBy(workersStats, 'routes');

  log(
    'TOTAL: duration: %d, routes: %d, fetchCount: %d, avg per route: %d',
    round(stats.duration),
    totalRoutes,
    sumBy(workersStats, 'fetchCount'),
    round(stats.duration / totalRoutes)
  );

  return stats;
};

module.exports = {
  write,
  display
};
