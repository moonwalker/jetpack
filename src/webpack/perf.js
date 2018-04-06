const { performance } = require('perf_hooks');

const getStartName = name => `${name}-start`;
const getEndName = name => `${name}-end`;

const start = name => performance.mark(getStartName(name));

const end = (name) => {
  const startName = getStartName(name);
  const endName = getEndName(name);

  performance.mark(endName);
  performance.measure(name, startName, endName);

  const measures = performance.getEntriesByName(name);

  performance.clearMeasures(name);
  performance.clearMarks(startName);
  performance.clearMarks(endName);

  return measures.length === 0 ? 0 : measures[0].duration;
};

module.exports = {
  start,
  end
};
