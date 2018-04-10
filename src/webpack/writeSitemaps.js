const { resolve } = require('path');
const fs = require('fs-extra');

const { debug } = require('../utils');

const log = debug('build', 'sitemap');

const { paths } = require('./defaults');

module.exports = (sitemaps) => {
  if (!sitemaps) {
    return null;
  }

  const sitemapdir = paths.output.path;

  return Promise.all(sitemaps.map((sitemap) => {
    const sitemapPath = resolve(sitemapdir, sitemap.filename);

    log('creating', sitemapPath, `${(sitemap.content.length / 1048576).toFixed(1)}MB`);

    return fs.outputFile(sitemapPath, sitemap.content);
  }));
};
