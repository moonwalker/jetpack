const path = require('path');
const { flatten } = require('lodash');
const fse = require('fs-extra');

const { paths } = require('../defaults');
const log = require('../debug')('prerender', 'stats');

module.exports = (stats) => {
  const outputFilepath = path.join(paths.artifacts.path, paths.artifacts.prerender);
  const data = flatten(stats);

  return fse.outputJSON(
    outputFilepath,
    data,
    { spaces: 2 }
  ).then(() => log('Prerender stats saved to %s', outputFilepath));
};
