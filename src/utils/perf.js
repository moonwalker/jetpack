const { performance, PerformanceObserver } = require('perf_hooks');

const getStartName = name => `${name}-start`;
const getEndName = name => `${name}-end`;

const start = name => performance.mark(getStartName(name));

const end = name => new Promise((resolve) => {
  const startName = getStartName(name);
  const endName = getEndName(name);

  const perfObs = new PerformanceObserver((list, observer) => {
    const measures = list.getEntriesByName(name);

    if (performance.clearMeasures) {
      performance.clearMeasures(name);
    }

    observer.disconnect();

    resolve(measures.length === 0 ? 0 : measures[0].duration);
  });
  perfObs.observe({ entryTypes: ['measure'] });

  performance.mark(endName);
  performance.measure(name, startName, endName);
  performance.clearMarks([startName, endName]);
});

module.exports = {
  start,
  end
};
